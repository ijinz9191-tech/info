# Authenticated Rate Limiting for gRPC Services

This guide walks through configuring authenticated rate limiting for a gRPC service using Kuadrant's RateLimitPolicy and AuthPolicy attached to a GRPCRoute. It demonstrates:

1. **Service-level rate limiting** using a CEL predicate on the whole GRPCRoute
2. **Method-level overrides** using GRPCRoute section name targeting
3. **Per-method authentication** combined with rate limiting on a specific GRPCRoute section

## Prerequisites

- Kubernetes cluster with the Kuadrant operator installed, and an instance of Kuadrant running in the cluster. See our [Getting Started](/latest/getting-started) guide for more information.
- [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl) command line tool.
- [grpcurl](https://github.com/fullstorydev/grpcurl) for testing gRPC endpoints.

### Setup environment variables

Set the following environment variables used for convenience in this guide:

```bash
export KUADRANT_GATEWAY_NS=api-gateway # Namespace for the example Gateway
export KUADRANT_GATEWAY_NAME=external  # Name for the example Gateway
export KUADRANT_GRPC_NS=grpcbin       # Namespace for the example gRPC app
```

### Create an Ingress Gateway

Create the namespace the Gateway will be deployed in:

```bash
kubectl create ns ${KUADRANT_GATEWAY_NS}
```

Create a gateway:

```sh
kubectl apply -f - <<EOF
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: ${KUADRANT_GATEWAY_NAME}
  namespace: ${KUADRANT_GATEWAY_NS}
  labels:
    kuadrant.io/gateway: "true"
spec:
  gatewayClassName: istio
  listeners:
    - name: http
      protocol: HTTP
      port: 80
      allowedRoutes:
        namespaces:
          from: All
EOF
```

> **Note:** The `Gateway` resource created above uses Istio as the gateway provider. For Envoy Gateway, use the Envoy Gateway `GatewayClass` as the `gatewayClassName`.

Check the status of the `Gateway` ensuring the gateway is Accepted and Programmed:

```bash
kubectl get gateway ${KUADRANT_GATEWAY_NAME} -n ${KUADRANT_GATEWAY_NS} -o=jsonpath='{.status.conditions[?(@.type=="Accepted")].message}{"\n"}{.status.conditions[?(@.type=="Programmed")].message}{"\n"}'
```

### Deploy the gRPC backend

Create the namespace for the gRPC application:

```bash
kubectl create ns ${KUADRANT_GRPC_NS}
```

Deploy the grpcbin echo service — a gRPC equivalent of httpbin with built-in reflection support:

```bash
kubectl apply -f https://raw.githubusercontent.com/Kuadrant/kuadrant-operator/main/examples/grpc-backend/grpcbin.yaml -n ${KUADRANT_GRPC_NS}
```

Verify the deployment is ready:

```bash
kubectl get pods -l app=grpcbin -n ${KUADRANT_GRPC_NS}
```

### Create a GRPCRoute with named sections

Create a GRPCRoute with named rules that use GRPCRoute `matches` to separate traffic by method. Each rule uses a [`GRPCMethodMatch`](https://gateway-api.sigs.k8s.io/reference/spec/#gateway.networking.k8s.io/v1.GRPCMethodMatch) to match a specific service and method:

```bash
kubectl apply -f - <<EOF
apiVersion: gateway.networking.k8s.io/v1
kind: GRPCRoute
metadata:
  name: grpcbin
  namespace: ${KUADRANT_GRPC_NS}
spec:
  parentRefs:
    - name: ${KUADRANT_GATEWAY_NAME}
      namespace: ${KUADRANT_GATEWAY_NS}
  hostnames: ["grpcbin.local"]
  rules:
    - name: unary-methods
      matches:
        - method:
            service: grpcbin.GRPCBin
            method: DummyUnary
      backendRefs:
        - name: grpcbin
          port: 9000
    - name: header-methods
      matches:
        - method:
            service: grpcbin.GRPCBin
            method: HeadersUnary
      backendRefs:
        - name: grpcbin
          port: 9000
    - name: other
      backendRefs:
        - name: grpcbin
          port: 9000
EOF
```

This creates three rules:

- **`unary-methods`** — matches `grpcbin.GRPCBin/DummyUnary`
- **`header-methods`** — matches `grpcbin.GRPCBin/HeadersUnary`
- **`other`** — catch-all for remaining traffic (including gRPC reflection, used by tools like `grpcurl`)

The named sections can be referenced by policies for fine-grained targeting.

### Verify the route

Export the gateway address and test both methods:

```bash
export KUADRANT_INGRESS_HOST=$(kubectl get gtw ${KUADRANT_GATEWAY_NAME} -n ${KUADRANT_GATEWAY_NS} -o jsonpath='{.status.addresses[0].value}')
export KUADRANT_INGRESS_PORT=$(kubectl get gtw ${KUADRANT_GATEWAY_NAME} -n ${KUADRANT_GATEWAY_NS} -o jsonpath='{.spec.listeners[?(@.name=="http")].port}')
export KUADRANT_GATEWAY_URL=${KUADRANT_INGRESS_HOST}:${KUADRANT_INGRESS_PORT}
```

> **Note:** If the gateway address is not available, try forwarding requests to the service:
>
> ```sh
> kubectl port-forward -n ${KUADRANT_GATEWAY_NS} service/${KUADRANT_GATEWAY_NAME}-istio 9080:80 >/dev/null 2>&1 &
> export KUADRANT_GATEWAY_URL=localhost:9080
> ```

Test DummyUnary:

```bash
grpcurl -plaintext -authority grpcbin.local -d '{"f_string":"hello"}' $KUADRANT_GATEWAY_URL grpcbin.GRPCBin/DummyUnary
```

Expected:
```json
{
  "fString": "hello"
}
```

Test HeadersUnary:

```bash
grpcurl -plaintext -authority grpcbin.local $KUADRANT_GATEWAY_URL grpcbin.GRPCBin/HeadersUnary
```

Expected: a response containing request metadata headers.

## Step 1: Service-level rate limiting with CEL predicates

Apply a RateLimitPolicy to the entire GRPCRoute using a CEL predicate to match all grpcbin traffic. This sets a default rate limit of 10 requests per 10 seconds across all methods:

```bash
kubectl apply -f - <<EOF
apiVersion: kuadrant.io/v1
kind: RateLimitPolicy
metadata:
  name: grpcbin-rlp
  namespace: ${KUADRANT_GRPC_NS}
spec:
  targetRef:
    group: gateway.networking.k8s.io
    kind: GRPCRoute
    name: grpcbin
  defaults:
    limits:
      "grpcbin-service":
        rates:
        - limit: 10
          window: 10s
        when:
        - predicate: "request.url_path.startsWith('/grpcbin.GRPCBin/')"
EOF
```

The `when` predicate ensures only calls to the `grpcbin.GRPCBin` service are rate limited. gRPC reflection calls (used by tools like `grpcurl`) are excluded, making test results predictable.

> **Note:** It may take a couple of minutes for the RateLimitPolicy to be applied depending on your cluster.

Verify the policy is accepted:

```bash
kubectl get ratelimitpolicy grpcbin-rlp -n ${KUADRANT_GRPC_NS} -o wide
```

Wait for `Accepted` and `Enforced` conditions to be `True`.

### Test the service-level limit

Both methods share the same 10 requests per 10 second limit:

```bash
for i in {1..12}; do
  echo "Request $i:"
  grpcurl -plaintext -authority grpcbin.local \
    -d '{"f_string": "hello"}' \
    $KUADRANT_GATEWAY_URL grpcbin.GRPCBin/DummyUnary
  sleep 0.5
done
```

Expected: 10 successful responses, then `Code: Unavailable` (rate limited) for requests 11-12.

## Step 2: Method-specific override with section name targeting

With the service-level policy still in place, add a second RateLimitPolicy that targets a specific GRPCRoute section. This overrides the default for that section only:

```bash
kubectl apply -f - <<EOF
apiVersion: kuadrant.io/v1
kind: RateLimitPolicy
metadata:
  name: grpcbin-unary-rlp
  namespace: ${KUADRANT_GRPC_NS}
spec:
  targetRef:
    group: gateway.networking.k8s.io
    kind: GRPCRoute
    name: grpcbin
    sectionName: unary-methods
  limits:
    "unary-limit":
      rates:
      - limit: 5
        window: 10s
EOF
```

Now the rate limits are:

| Method | Rate Limit | Source |
|--------|-----------|--------|
| DummyUnary | 5 per 10s | Section-level override (`grpcbin-unary-rlp`) |
| HeadersUnary | 10 per 10s | Inherited from route-level default (`grpcbin-rlp`) |

### Test the override

**Test DummyUnary (5rp10s override):**

```bash
for i in {1..8}; do
  echo "Request $i:"
  grpcurl -plaintext -authority grpcbin.local \
    -d '{"f_string": "hello"}' \
    $KUADRANT_GATEWAY_URL grpcbin.GRPCBin/DummyUnary
  sleep 1
done
```

Expected: 5 successful responses, then `Code: Unavailable` from request 6 onwards.

**Test HeadersUnary (10rp10s default):**

```bash
for i in {1..12}; do
  echo "Request $i:"
  grpcurl -plaintext -authority grpcbin.local \
    $KUADRANT_GATEWAY_URL grpcbin.GRPCBin/HeadersUnary
  sleep 0.5
done
```

Expected: 10 successful responses, then `Code: Unavailable` for requests 11-12. The route-level default still applies.

## Step 3: Add authentication to a specific section

Apply an AuthPolicy targeting only the `unary-methods` section. DummyUnary will now require an API key, while HeadersUnary remains open:

```bash
kubectl apply -f - <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: grpcbin-apikey
  namespace: ${KUADRANT_GRPC_NS}
  labels:
    authorino.kuadrant.io/managed-by: authorino
    app: grpcbin
  annotations:
    secret.kuadrant.io/user-id: grpcuser
stringData:
  api_key: GRPCBINKEY123
type: Opaque
---
apiVersion: kuadrant.io/v1
kind: AuthPolicy
metadata:
  name: grpcbin-auth
  namespace: ${KUADRANT_GRPC_NS}
spec:
  targetRef:
    group: gateway.networking.k8s.io
    kind: GRPCRoute
    name: grpcbin
    sectionName: unary-methods
  rules:
    authentication:
      "api-key":
        apiKey:
          selector:
            matchLabels:
              app: grpcbin
          allNamespaces: true
        credentials:
          authorizationHeader:
            prefix: APIKEY
EOF
```

Now the policies in effect are:

| Method | Rate Limit | Authentication |
|--------|-----------|----------------|
| DummyUnary | 5 per 10s (section override) | API key required |
| HeadersUnary | 10 per 10s (route default) | None |

### Test the combined setup

**DummyUnary without API key — rejected (401):**

```bash
grpcurl -plaintext -authority grpcbin.local \
  -d '{"f_string": "hello"}' \
  $KUADRANT_GATEWAY_URL grpcbin.GRPCBin/DummyUnary
```

Expected:
```text
Code: Unauthenticated
Message:
```

> **Note:** Wait 10 seconds before the next test to ensure the rate limit counter from the unauthenticated request has reset.

**DummyUnary with API key — accepted and rate limited (5rp10s):**

```bash
for i in {1..8}; do
  echo "Request $i:"
  grpcurl -plaintext -authority grpcbin.local \
    -H 'Authorization: APIKEY GRPCBINKEY123' \
    -d '{"f_string": "hello"}' \
    $KUADRANT_GATEWAY_URL grpcbin.GRPCBin/DummyUnary
  sleep 1
done
```

Expected: 5 successful responses, then `Code: Unavailable` from request 6 onwards.

**HeadersUnary without API key — accepted and rate limited (10rp10s):**

```bash
for i in {1..12}; do
  echo "Request $i:"
  grpcurl -plaintext -authority grpcbin.local \
    $KUADRANT_GATEWAY_URL grpcbin.GRPCBin/HeadersUnary
  sleep 0.5
done
```

Expected: 10 successful responses, then `Code: Unavailable`. No authentication required — the AuthPolicy only targets `unary-methods`.

## Cleanup

```bash
kubectl delete authpolicy grpcbin-auth -n ${KUADRANT_GRPC_NS}
kubectl delete ratelimitpolicy grpcbin-unary-rlp -n ${KUADRANT_GRPC_NS}
kubectl delete ratelimitpolicy grpcbin-rlp -n ${KUADRANT_GRPC_NS}
kubectl delete secret grpcbin-apikey -n ${KUADRANT_GRPC_NS}
kubectl delete grpcroute grpcbin -n ${KUADRANT_GRPC_NS}
kubectl delete -f https://raw.githubusercontent.com/Kuadrant/kuadrant-operator/main/examples/grpc-backend/grpcbin.yaml -n ${KUADRANT_GRPC_NS}
kubectl delete ns ${KUADRANT_GRPC_NS}
kubectl delete gateway ${KUADRANT_GATEWAY_NAME} -n ${KUADRANT_GATEWAY_NS}
kubectl delete ns ${KUADRANT_GATEWAY_NS}
```

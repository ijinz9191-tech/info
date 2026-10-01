# Kuadrant Auth

## Secure API access with authentication and authorization

When protecting APIs in your Kubernetes infrastructure, you need to verify who is making requests (authentication) and what they're allowed to do (authorization). Kuadrant provides flexible authentication and authorization capabilities through the AuthPolicy custom resource, helping you balance security requirements with operational simplicity.

### Common authentication and authorization jobs

Kuadrant AuthPolicy helps you accomplish these common security tasks:

| Job | When you need this | Solution |
|-----|-------------------|----------|
| **Secure API access with appropriate authentication** | APIs need protection but different use cases require different authentication methods | Choose from API keys, JWT/OIDC, X.509 certificates, OAuth2 introspection, Kubernetes TokenReview, or allow anonymous access based on your security and compliance requirements |
| **Verify cryptographic identity with client certificates** | Your organization requires strong identity verification, zero-trust architecture, or compliance with security standards | Use X.509 client certificate authentication with defense-in-depth validation at both TLS and application layers |
| **Control access with fine-grained authorization** | Authenticated users need different permissions based on roles, attributes, or complex business logic | Enforce authorization rules using pattern matching, OPA policies, Kubernetes RBAC, or SpiceDB |
| **Apply consistent security policies across API infrastructure** | You manage multiple APIs and routes and need to balance developer flexibility with platform governance | Apply AuthPolicies at Gateway, HTTPRoute, or GRPCRoute level with defaults and overrides to establish security baselines |
| **Secure outbound API calls with centralized credential management** | Services call external APIs requiring authentication, and you want to avoid distributing secrets to every pod | Use egress gateway credential injection to authenticate internal workloads and inject external API credentials at the gateway |

## Understanding how Kuadrant auth integrates with your infrastructure

When evaluating Kuadrant for API security, you'll want to understand how it fits into your existing Kubernetes and Gateway API infrastructure without requiring changes to your application code.

### How authentication requests are processed

Kuadrant uses the industry-standard [Envoy External Authorization](https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_filters/ext_authz_filter) protocol to enforce authentication and authorization policies:

1. **Request arrives**: Your Gateway (Istio, Envoy Gateway, etc.) receives an API request
2. **Policy evaluation**: The gateway checks if any AuthPolicy matches the request based on the HTTPRoute or Gateway configuration
3. **External authorization call**: If a policy matches, the gateway sends an authorization check request to Authorino (the external auth service)
4. **Authentication and authorization**: Authorino evaluates your authentication rules (API key, JWT, X.509, etc.) and authorization policies
5. **Decision returned**: Authorino responds with either `ALLOW` (request proceeds) or `DENY` (request rejected with appropriate status code)

This approach provides several benefits:
- **Zero application changes**: Authentication logic lives in policies, not in your code
- **Consistent enforcement**: Same auth rules apply regardless of which service handles the request
- **Defense in depth**: Some authentication methods (like X.509) validate at both the gateway (L4/TLS) and application (L7) layers
- **Dynamic policy updates**: Change authentication requirements without redeploying services

### What AuthPolicy provides

A Kuadrant AuthPolicy custom resource:

1. **Targets Gateway API resources**: Attaches to [HTTPRoute](https://gateway-api.sigs.k8s.io/reference/spec/#gateway.networking.k8s.io/v1.HTTPRoute), [GRPCRoute](https://gateway-api.sigs.k8s.io/reference/spec/#gateway.networking.k8s.io/v1.GRPCRoute), or [Gateway](https://gateway-api.sigs.k8s.io/reference/spec/#gateway.networking.k8s.io/v1.Gateway) to define which traffic to protect
2. **Supports fine-grained targeting**: Apply policies to specific Gateway listeners or individual HTTPRoute/GRPCRoute rules using `sectionName`
3. **Abstracts complexity**: Simplifies Envoy External Authorization configuration while providing access to powerful authentication methods
4. **Enables platform governance**: Platform engineers can set `defaults` to establish security baselines that apply until application teams define more specific policies
5. **Enforces mandatory controls**: Platform engineers can set `overrides` to enforce organization-wide security requirements that cannot be weakened by route-level policies

Check out the [API reference](../reference/authpolicy.md) for the complete AuthPolicy CRD specification.

## Choosing the right authentication method

When securing API access, different use cases require different authentication approaches. Choose the authentication method that best matches your security requirements, infrastructure, and user experience needs.

### Authentication method decision guide

| Authentication Method | When to use | Key characteristics | Learn more |
|-----------------------|-------------|---------------------|------------|
| **API Key** | Service-to-service communication, developer access, simple token-based auth, small-to-mid scale deployments | Simple to implement; secrets stored in Kubernetes; supports namespace-scoped or cluster-wide keys | [API Key authentication](https://docs.kuadrant.io/latest/authorino/docs/features/#api-key-authenticationapikey) |
| **JWT / OIDC** | End-user authentication, SSO, federated identity | Industry-standard tokens; integrates with identity providers (Keycloak, Auth0, Okta); supports token validation and claims extraction | [JWT verification](https://docs.kuadrant.io/latest/authorino/docs/features/#jwt-verification-authenticationjwt) |
| **X.509 Client Certificates** | Zero-trust architecture, cryptographic identity, compliance requirements (mTLS), machine-to-machine with PKI | Strongest authentication; defense-in-depth validation; multi-CA trust with label selectors; requires certificate infrastructure | [X.509 authentication](auth-x509.md) |
| **OAuth2 Introspection** | Validate tokens issued by external OAuth2/OIDC servers | Delegates validation to token issuer; works with opaque tokens; real-time revocation check | [OAuth2 introspection](https://docs.kuadrant.io/latest/authorino/docs/features/#oauth-20-introspection-authenticationoauth2introspection) |
| **Kubernetes TokenReview** | In-cluster service-to-service auth, ServiceAccount tokens | Native Kubernetes integration; validates ServiceAccount tokens; leverages existing RBAC | [Kubernetes TokenReview](https://docs.kuadrant.io/latest/authorino/docs/features/#kubernetes-tokenreview-authenticationkubernetestokenreview) |
| **Plain Identity** | Pre-authenticated requests, custom authentication handled by upstream proxy | Identity extracted from context; authentication performed elsewhere; minimal overhead | [Plain authentication](https://docs.kuadrant.io/latest/authorino/docs/features/#plain-authenticationplain) |
| **Anonymous Access** | Public endpoints, unauthenticated access to specific routes | No authentication required; useful with conditional policies or selective route protection | [Anonymous access](../user-guides/auth/anonymous-access.md) |

### Choosing an authorization method

After authentication, you may need to enforce authorization rules to control what authenticated users can access:

| Authorization Method | When to use | Key characteristics | Learn more |
|---------------------|-------------|---------------------|------------|
| **Pattern Matching** | Simple attribute-based rules, checking claims or metadata values | CEL expressions; fast evaluation; good for straightforward conditions | [Pattern-matching authorization](https://docs.kuadrant.io/latest/authorino/docs/features/#pattern-matching-authorization-authorizationpatternmatching) |
| **OPA (Open Policy Agent)** | Complex authorization logic, business rules, policy-as-code | Rego policy language; centralized policy management; supports sophisticated evaluation | [OPA authorization](https://docs.kuadrant.io/latest/authorino/docs/features/#open-policy-agent-opa-rego-policies-authorizationopa) |
| **Kubernetes SubjectAccessReview** | Leverage Kubernetes RBAC, in-cluster authorization | Native K8s integration; uses existing Roles and RoleBindings; consistent with cluster permissions | [Kubernetes SubjectAccessReview](https://docs.kuadrant.io/latest/authorino/docs/features/#kubernetes-subjectaccessreview-authorizationkubernetessubjectaccessreview) |
| **SpiceDB** | Fine-grained permissions, relationship-based access control | External Authzed/SpiceDB server; scales to complex permission models; Google Zanzibar-inspired | [SpiceDB authorization](https://docs.kuadrant.io/latest/authorino/docs/features/#spicedb-authorizationspicedb) |

## X.509 client certificate authentication

For cryptographic identity verification using X.509 client certificates with mTLS, see the dedicated [X.509 Client Certificate Authentication overview](auth-x509.md). This authentication method is ideal for zero-trust architectures, compliance requirements, and machine-to-machine communication with PKI.

The X.509 overview covers:
- Configuration tiers (Gateway API v1.5+, provider-specific resources, header-only)
- Defense-in-depth security model with L4 and L7 validation
- Multi-CA trust with label selectors
- Certificate requirements and constraints
- Security considerations and best practices
- Troubleshooting guide


## Apply consistent security policies across your API infrastructure

When managing multiple APIs, routes, and gateways, you need flexible policy targeting that balances developer autonomy with platform governance. AuthPolicy provides multiple targeting options to match your organizational structure and security requirements.

### Protect specific routes with HTTPRoute or GRPCRoute-targeted policies

**Use route-targeted policies when:** Application teams own their routes and need to define authentication/authorization appropriate for their specific API endpoints.

An AuthPolicy targeting an HTTPRoute or GRPCRoute can protect:
- **All traffic** for the entire route, or
- **Specific rules** within the route by using `sectionName` to target individual route rules

The policy applies to all hostnames and gateways referenced by the HTTPRoute or GRPCRoute. Use top-level `when` conditions (`spec.rules.when`) for additional filtering based on request attributes.

**Example - Protect an entire HTTPRoute:**

```yaml
apiVersion: kuadrant.io/v1
kind: AuthPolicy
metadata:
  name: my-auth
spec:
  targetRef:
    group: gateway.networking.k8s.io
    kind: HTTPRoute
    name: my-route
  rules: { … }
```

```
┌─────────────────────┐            ┌─────────────────────┐
│ (Gateway namespace) │            │   (App namespace)   │
│                     │            │                     │
│    ┌─────────┐      │ parentRefs │  ┌────────────┐     │
│    │ Gateway │◄─────┼────────────┼──┤ HTTPRoute  │     │
│    └─────────┘      │            │  | (my-route) │     |
│                     │            │  └────────────┘     │
│                     │            │        ▲            │
│                     │            │        │            │
│                     │            │        │ targetRef: │
│                     │            │        │ - my-route │
│                     │            │        │            │
│                     │            │  ┌─────┴──────┐     │
│                     │            │  │ AuthPolicy │     │
│                     │            │  │ (my-auth)  │     │
│                     │            │  └────────────┘     │
└─────────────────────┘            └─────────────────────┘
```

**Example - Protect only specific rules within a HTTPRoute:**

```yaml
apiVersion: kuadrant.io/v1
kind: AuthPolicy
metadata:
  name: my-route-auth
spec:
  targetRef:
    group: gateway.networking.k8s.io
    kind: HTTPRoute
    name: my-route
    sectionName: rule-2
  rules: { … }
```

```
┌─────────────────────┐            ┌──────────────────────┐
│ (Gateway namespace) │            │    (App namespace)   │
│                     │            │                      │
│    ┌─────────┐      │ parentRefs │  ┌────────────┐      │
│    │ Gateway │◄─────┼────────────┼──┤ HTTPRoute  │      │
│    └─────────┘      │            │  | (my-route) │      |
│                     │            │  |------------│      |
│                     │            │  | - rule-1   │      |
│                     │            │  | - rule-2   │      |
│                     │            │  └────────────┘      │
│                     │            │        ▲             │
│                     │            │        │             │
│                     │            │        │ targetRef:  │
│                     │            │        │ - rule-2    │
│                     │            │        │             │
│                     │            │  ┌─────┴───────────┐ │
│                     │            │  │   AuthPolicy    │ │
│                     │            │  │ (my-route-auth) │ │
│                     │            │  └─────────────────┘ │
└─────────────────────┘            └──────────────────────┘
```

### Establish platform-wide security baselines with Gateway-targeted policies

**Use Gateway-targeted policies when:** Platform engineers need to enforce organization-wide security requirements, establish default authentication for all routes, or ensure no route can be deployed without minimum security controls.

An AuthPolicy targeting a Gateway automatically applies to all routes attached to that gateway, including routes created after the policy. More specific HTTPRoute or GRPCRoute-targeted policies can override gateway defaults (unless you use `overrides` instead of `defaults`).

Key behaviors:
- **Automatic coverage**: New HTTPRoutes or GRPCRoutes attached to the gateway are automatically protected
- **Defaults allow specificity**: Route-level policies override gateway defaults, enabling application teams to customize authentication
- **Overrides enforce mandates**: Gateway overrides cannot be weakened by route-level policies, ensuring compliance requirements

**Example - Establish default authentication for all routes:**

```yaml
apiVersion: kuadrant.io/v1
kind: AuthPolicy
metadata:
  name: my-gw-auth
spec:
  targetRef:
    group: gateway.networking.k8s.io
    kind: Gateway
    name: my-gw
  defaults: # alternatively: `overrides`
    rules: { … }
```

```
┌───────────────────┐             ┌──────────────────────┐
│ (Infra namespace) │             │    (App namespace)   │
│                   │             │                      │
│  ┌─────────┐      │  parentRefs │  ┌───────────┐       │
│  │ Gateway │◄─────┼─────────────┼──┤ HTTPRoute │       │
│  | (my-gw) |      │             │  | (my-route)│       │
│  └─────────┘      │             │  └───────────┘       │
│       ▲           │             │        ▲             │
│       │           │             │        │             │
│       │ targetRef:│             │        │ targetRef:  │
│       │ - my-gw   │             │        │ - my-route  │
│       │           │             │        │             │
│ ┌─────┴────────┐  │             │  ┌─────┴───────────┐ │
│ │  AuthPolicy  │  │             │  │   AuthPolicy    │ │
│ | (my-gw-auth) |  │             │  │ (my-route-auth) │ │
│ └──────────────┘  │             │  └─────────────────┘ │
└───────────────────┘             └──────────────────────┘
```

### Balance platform governance with application flexibility using Defaults and Overrides

When managing security across multiple teams and services, you need to balance two goals: establishing organization-wide security baselines while giving application teams the flexibility to customize authentication for their specific needs.

AuthPolicy provides two mechanisms based on Gateway API [GEP-713](https://gateway-api.sigs.k8s.io/geps/gep-713/):

| Use | When | Example scenario |
|-----|------|------------------|
| **Defaults** (`spec.defaults`) | You want to establish security baselines that application teams can customize or override | Platform team sets API key authentication at the Gateway; app teams can override with JWT for specific routes |
| **Overrides** (`spec.overrides`) | You need to enforce mandatory security requirements that cannot be weakened | Security compliance requires all production traffic to use mTLS; override ensures no route can bypass this requirement |

**How defaults work:**
- Policies without explicit `defaults` or `overrides` blocks behave as defaults
- Default rules apply until a more specific policy supersedes them
- Application teams can replace defaults with route-specific policies
- Enables a "secure by default, customize as needed" approach

**Example use case for defaults:** Set a "deny-all" policy at the Gateway to protect against unintentional exposure. Application teams then define specific authentication rules for their routes, effectively opening controlled access.

**How overrides work:**
- Override rules win over any more specific policies
- Enforces mandatory controls that cannot be weakened by route-level policies
- Ensures organization-wide compliance requirements are always met

**Example use case for overrides:** Enforce mutual TLS for all production traffic regardless of what application teams configure, ensuring compliance with security standards.

**Policy hierarchy:**

Defaults and overrides work at any level of the Gateway API hierarchy:
1. Gateway (broadest)
2. Gateway listener (via `sectionName`)
3. HTTPRoute / GRPCRoute
4. HTTPRouteRule / GRPCRouteRule (via `sectionName`) (most specific)

The "effective policy" for each request is computed based on hierarchy rules from [GEP-713](https://gateway-api.sigs.k8s.io/geps/gep-713/#resolving-conflicts). Kuadrant implements 4 [merge strategies](https://gateway-api.sigs.k8s.io/geps/gep-713/#designing-a-merge-strategy) allowing atomic or merged composition of policy rules:
- **Atomic defaults:** The most specific policy fully replaces less specific ones for the topological scope it applies to. No merging of rules occurs. This is the default behavior.
- **Atomic overrides:** The broadest policy fully replaces more specific ones. No merging of rules occurs.
- **Merged defaults:** Individual rules from the most specific policy replace rules with the same name in less specific ones, while rules with different names are both maintained.
- **Merged overrides:** Individual rules from the broadest policy replace rules with the same name in more specific ones, while rules with different names are both maintained.

> [!NOTE] Learn more about Defaults & Overrides
> For detailed behavior and examples of Defaults & Overrides used in the AuthPolicies, see [RFC-0009](https://github.com/Kuadrant/architecture/blob/main/rfcs/0009-defaults-and-overrides.md).

### Understand how policies apply to wildcard hostnames

When you define routes with wildcard hostnames (e.g., `*.example.com`) alongside specific hostnames (e.g., `api.example.com`), you may wonder which AuthPolicy takes precedence.

**Principle: "Most specific wins"**

Without overrides in place, the AuthPolicy targeting the most specific matching route applies. Policies don't combine—only one policy's rules are enforced per request.

**Example scenario:**
- AuthPolicy A → HTTPRoute A (`a.toystore.com`)
- AuthPolicy B → HTTPRoute B (`b.toystore.com`)
- AuthPolicy W → HTTPRoute W (`*.toystore.com`)

**Request behavior:**
- Request to `a.toystore.com` → AuthPolicy A applies (specific hostname wins)
- Request to `b.toystore.com` → AuthPolicy B applies (specific hostname wins)
- Request to `other.toystore.com` → AuthPolicy W applies (wildcard catches unmatched)

This allows you to set broad defaults with wildcards while overriding authentication for specific subdomains.

### Apply policies conditionally based on request attributes with `when` conditions

**Use `when` conditions when:** You need to activate authentication based on request attributes that can't be expressed in HTTPRoute matching rules, such as source IP ranges, identity-based attributes, resource attributes, custom metadata, or time-based conditions.

Common use cases:
- Apply different authentication to requests from internal vs. external IP ranges
- Enable authentication only during specific time windows
- Apply policies based on JWT claims or other dynamic attributes

`when` conditions support complex boolean expressions with AND/OR operators and grouping, compatible with Authorino [conditions](https://docs.kuadrant.io/latest/authorino/docs/features/#common-feature-conditions-when).

**Example - Apply different authentication based on source IP (internal vs. external traffic):**

```yaml
apiVersion: kuadrant.io/v1
kind: AuthPolicy
metadata:
  name: network-based-auth
spec:
  targetRef:
    group: gateway.networking.k8s.io
    kind: HTTPRoute
    name: my-api
  rules:
    authentication:
      # Allow anonymous access from internal networks
      "internal-anonymous":
        anonymous: {}
        when:
        - predicate: "source.address.matches('10\\..*|172\\.(1[6-9]|2[0-9]|3[01])\\..*|192\\.168\\..*')"

      # Require strong authentication from external networks
      "external-mtls":
        x509:
          selector:
            matchLabels:
              tier: production
        when:
        # Activate when source is NOT in private IP ranges
        - predicate: "!source.address.matches('10\\..*|172\\.(1[6-9]|2[0-9]|3[01])\\..*|192\\.168\\..*')"
```

This example shows a scenario that cannot be achieved with HTTPRoute matching alone—HTTPRoute has no support for source IP-based routing or matching.

Conditions implement Kuadrant's [Well-known Attributes](https://github.com/Kuadrant/architecture/blob/main/rfcs/0002-well-known-attributes.md). You can use [Common Expression Language (CEL)](https://cel.dev/) predicates or [JSON path selector modifiers](https://docs.kuadrant.io/latest/authorino/docs/features/#string-modifiers) for advanced conditions.

## Secure outbound API calls with credential injection at egress gateways

When your services call external APIs that require authentication, you need to centrally manage external credentials at the egress gateway rather than distributing secrets to every pod. This approach maintains security, simplifies credential rotation, and provides centralized audit logging for external API access.

### How egress credential injection works

**Use egress credential injection when:**
- Services need to call external APIs (payment processors, cloud providers, SaaS platforms)
- External APIs require authentication (API keys, OAuth tokens, custom headers)
- You want to avoid distributing external API credentials to every pod
- You need centralized credential management and rotation
- You want to authenticate internal workloads before allowing external API access

**The credential injection pattern:**

1. **Authenticate internal workload**: Gateway authenticates the workload making the outbound request using internal mechanisms (Kubernetes ServiceAccount tokens, JWT, API keys)
2. **Fetch external credentials**: Gateway retrieves external API credentials from secure storage (Kubernetes Secrets, Vault, external metadata sources)
3. **Inject credentials**: Gateway replaces or adds authentication headers in the outbound request with external API credentials
4. **Forward request**: Request proceeds to the external API with proper authentication


**Key characteristics:**
- **Same attachment model**: AuthPolicy attaches to egress Gateways and HTTPRoutes identically to ingress—Kuadrant doesn't distinguish between ingress and egress
- **Centralized secret management**: External credentials stored in one location, not distributed to pods
- **Credential rotation**: Update credentials at the gateway without redeploying workloads
- **Audit trail**: All external API access logged at the gateway
- **Defense in depth**: Authenticate internal workloads before allowing external API access

See the [Egress Gateway Credential Injection](../user-guides/egress/credential-injection.md) user guide for a complete walkthrough including HTTPRoute configuration for external services.

## Examples and user guides

Explore these user guides for complete examples of protecting services with Kuadrant AuthPolicy:

### Authentication examples
- [X.509 Client Certificate Authentication](../user-guides/auth/x509-authentication.md) - Defense-in-depth mTLS with three tier options (Gateway API v1.5+, provider-specific, or header-only)
- [Anonymous Access](../user-guides/auth/anonymous-access.md) - Selectively allow unauthenticated access to specific routes
- [Enforcing authentication & authorization with Kuadrant AuthPolicy, for app developers and platform engineers](../user-guides/auth/auth-for-app-devs-and-platform-engineers.md) - API key authentication with platform governance

### Egress gateway examples
- [Egress Gateway Credential Injection](../user-guides/egress/credential-injection.md) - Centralized credential management for outbound API calls

### Authentication with rate limiting
- [Authenticated Rate Limiting for Application Developers](../user-guides/ratelimiting/authenticated-rl-for-app-developers.md)
- [Authenticated Rate Limiting with JWTs and Kubernetes RBAC](../user-guides/ratelimiting/authenticated-rl-with-jwt-and-k8s-authnz.md)
- [Authenticated Rate Limiting for gRPC Services](../user-guides/ratelimiting/authenticated-rl-for-app-developers-grpc-services.md)

## Known limitations

- AuthPolicies can only target HTTPRoutes/GRPCRoutes/Gateways defined within the same namespace of the AuthPolicy.
- Mixed HTTPRoute and GRPCRoute sharing the same hostname on a Gateway is not supported. Gateway implementations enforce [hostname uniqueness](https://gateway-api.sigs.k8s.io/concepts/api-overview/#hostname-matching) across route types — use separate hostnames for HTTP and gRPC traffic.
- AuthPolicies that reference other Kubernetes objects (typically `Secret`s) require those objects to the created in the same namespace as the `Kuadrant` custom resource managing the deployment. This is the case of AuthPolicies that define API key authentication with `allNamespaces` option set to `false` (default), where the API key Secrets must be created in the Kuadrant CR namespace and not in the AuthPolicy namespace.

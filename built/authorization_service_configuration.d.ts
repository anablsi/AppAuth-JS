import { Requestor } from './xhr';
/**
 * OpenIdConnect Issuer Configs
 */
export declare class OpenIdIssuerConfigs {
    url: string;
    prms: string;
    constructor(url: string, prms: string);
}
/**
 * Represents AuthorizationServiceConfiguration as a JSON object.
 */
export interface AuthorizationServiceConfigurationJson {
    authorization_endpoint: string;
    token_endpoint: string;
    revocation_endpoint: string;
    end_session_endpoint?: string;
    userinfo_endpoint?: string;
}
/**
 * Configuration details required to interact with an authorization service.
 *
 * More information at https://openid.net/specs/openid-connect-discovery-1_0-17.html
 */
export declare class AuthorizationServiceConfiguration {
    authorizationEndpoint: string;
    tokenEndpoint: string;
    revocationEndpoint: string;
    userInfoEndpoint?: string;
    endSessionEndpoint?: string;
    constructor(request: AuthorizationServiceConfigurationJson);
    toJson(): {
        authorization_endpoint: string;
        token_endpoint: string;
        revocation_endpoint: string;
        end_session_endpoint: string | undefined;
        userinfo_endpoint: string | undefined;
    };
    static fetchFromIssuer(openIdIssuerUrl: string, requestor?: Requestor): Promise<AuthorizationServiceConfiguration>;
    static fetchFromIssuer(openIdIssuerConfigs: OpenIdIssuerConfigs, requestor?: Requestor): Promise<AuthorizationServiceConfiguration>;
}

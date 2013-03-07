﻿(function (window)
{
    "use strict";

    if (window.PortableRest !== undefined)
    {
        return;
    }

    window.PortableRest = {};
    
    window.PortableRest.ContentTypes =
        {
            FormUrlEncoded: 0,
            Json: 1,
            Xml: 2
        };

    window.PortableRest.HttpMethod =
        {
            Delete: "DELETE",
            Get: "GET",
            Head: "HEAD",
            Options: "OPTIONS",
            Post: "POST",
            Put: "PUT",
            Trace: "TRACE"
        };

    window.PortableRest.HttpStatusCode =
        {
            Continue: 100,
            SwitchingProtocols: 101,
            Processing: 102,

            OK: 200,
            Created: 201,
            Accepted: 202,
            NonAuthoritativeInformation: 203,
            NoContent: 204,
            ResetContent: 205,
            PartialContent: 206,
            MultiStatus: 207,
            AlreadyReported: 208,
            ImUsed: 226,
            LowOnStorageSpace: 250,

            MultipleChoices: 300,
            MovedPermanently: 301,
            Found: 302,
            SeeOther: 303,
            NotModified: 304,
            UseProxy: 305,
            SwitchProxy: 306,
            TemporaryRedirect: 307,
            PermanentRedirect: 308,

            BadRequest: 400,
            Unauthorized: 401,
            PaymentRequired: 402,
            Forbidden: 403,
            NotFound: 404,
            MethodNotAllowed: 405,
            NotAcceptable: 406,
            ProxyAuthenticationRequired: 407,
            RequestTimeout: 408,
            Conflict: 409,
            Gone: 410,
            LengthRequired: 411,
            PreconditionFailed: 412,
            RequestEntityTooLarge: 413,
            RequestURITooLong: 414,
            UnsupportedMediaType: 415,
            RequestedRangeNotSatisfiable: 416,
            ExpectationFailed: 417,
            ImATeapot: 418,
            UnprocessableEntity: 422,
            Locked: 423,
            FailedDependency: 424,
            UpgradeRequired: 426,
            PreconditionRequired: 428,
            TooManyRequests: 429,
            RequestHeaderFieldsTooLarge: 431,

            InternalServerError: 500,
            NotImplemented: 501,
            BadGateway: 502,
            ServiceUnavailable: 503,
            GatewayTimeout: 504,
            HTTPVersionNotSupported: 505,
            VariantAlsoNegotiates: 506,
            InsufficientStorage: 507,
            LoopDetected: 508,
            NotExtended: 510,
            NetworkAuthenticationRequired: 511
        };

    window.PortableRest.RestRequest = function (resource, method)
    {
        /// <summary>Creates a new RestRequest instance for a given Resource and Method.</summary>
        /// <param name="resource" type="String">The specific resource to access.</param>
        /// <param name="method" type="window.PortableRest.HttpMethod">The HTTP method to use for the request.</param>
        /// <param name="ignoreRoot" type="Boolean"></param>
        /// <field name="contentType" type="window.PortableRest.ContentTypes" />
        /// <field name="method" type="window.PortableRest.HttpMethod" />
        /// <field name="resource" type="String" />
        /// <returns type="window.PortableRest.RestRequest" />
        
        if (!(this instanceof window.PortableRest.RestRequest))
        {
            return new window.PortableRest.RestRequest(resource, method, ignoreRoot);
        }

        this._urlSegments = [];
        this._parameters = [];
        this._credentials = null;

        this.contentType = window.PortableRest.ContentTypes.FormUrlEncoded;
        this.method = method || window.PortableRest.HttpMethod.Get;
        this.resource = resource || "";
    };

    window.PortableRest.RestRequest.prototype.addUrlSegment = function (key, value)
    {
        /// <summary></summary>
        /// <param name="key" type="String"></param>
        /// <param name="value" type="String"></param>
        
        this._urlSegments.push({ key: key, value: value });
    };

    window.PortableRest.RestRequest.prototype.addParameter = function (key, value)
    {
        /// <summary></summary>
        /// <param name="key" type="String"></param>
        /// <param name="value" type="Object"></param>
        
        this._parameters.push({ key: key, value: value });
    };

    window.PortableRest.RestRequest.prototype.setCredentials = function (user, password)
    {
        /// <summary></summary>
        /// <param name="user" type="String"></param>
        /// <param name="password" type="String"></param>

        this._credentials = { user: user, password: password };
    };

    window.PortableRest.RestRequest.prototype.clearCredentials = function ()
    {
        this._credentials = null;
    };

    window.PortableRest.RestRequest.prototype._getFormattedResource = function (baseUrl)
    {
        /// <summary></summary>
        /// <param name="baseUrl" type="String"></param>
        /// <returns type="String" />


        for (var urlSegmentsIndex = 0, urlSegmentsLength = this._urlSegments.length; urlSegmentsIndex < urlSegmentsLength; urlSegmentsIndex++)
        {
            var segment = this._urlSegments[urlSegmentsIndex];
            this.resource = this.resource.replace("{" + segment.key + "}", encodeURIComponent(segment.value));
        }

        if ((this.resource !== null) && (this.resource !== undefined) && (this.resource !== "") && (this.resource.indexOf("/") === 0))
        {
            this.resource = this.resource.substr(1);
        }

        if ((baseUrl !== null) && (baseUrl !== undefined) && (baseUrl !== ""))
        {
            this.resource = ((this.resource === null) || (this.resource === undefined) || (this.resource === "")) ? baseUrl : baseUrl + "/" + this.resource;
        }

        return this.resource;
    };

    window.PortableRest.RestRequest.prototype._getContentType = function ()
    {
        /// <summary></summary>
        /// <returns type="String" />
        
        switch (this.contentType)
        {
            case window.PortableRest.ContentTypes.FormUrlEncoded:
                return "application/x-www-form-urlencoded";
            case window.PortableRest.ContentTypes.Xml:
                return "application/xml";
            default:
                return "application/json";
        }
    };

    window.PortableRest.RestRequest.prototype._getRequestBody = function ()
    {
        /// <summary></summary>
        /// <returns type="String" />
        
        var parameters = "";

        switch (this.contentType)
        {
            case window.PortableRest.ContentTypes.FormUrlEncoded:
                for (var parameterIndex = 0, parametersLength = this._parameters.length; parameterIndex < parametersLength; parameterIndex++)
                {
                    var parameter = this._parameters[parameterIndex];
                    parameters = parameters + (parameters.length > 0 ? "&" : "") + encodeURIComponent(parameter.key) + "=" + encodeURIComponent(parameter.value.toString());
                }
                break;
            case window.PortableRest.ContentTypes.Xml:
                throw new Error("Sending XML is not yet supported, but will be added in a future release.");
            case window.PortableRest.ContentTypes.Json:
                parameters = this._parameters.length > 0 ? JSON.stringify(this._parameters[0].value) : "";
                break;
        }

        return parameters;
    };

    window.PortableRest.RestClient = function ()
    {
        /// <summary>Creates a new instance of the RestClient class.</summary>
        /// <field name="baseUrl" type="String" />
        /// <returns type="window.PortableRest.RestClient" />
        
        if (!(this instanceof window.PortableRest.RestClient))
        {
            return new window.PortableRest.RestClient();
        }

        this.baseUrl = "";
        this._headers = [];
        this._credentials = null;
    };

    window.PortableRest.RestClient.prototype.setCredentials = function (user, password)
    {
        /// <summary></summary>
        /// <param name="user" type="String"></param>
        /// <param name="password" type="String"></param>

        this._credentials = { user: user, password: password };
    };

    window.PortableRest.RestClient.prototype.clearCredentials = function ()
    {
        this._credentials = null;
    };

    window.PortableRest.RestClient.prototype.addHeader = function (key, value)
    {
        /// <summary>Adds a header for a given string key and string value.</summary>
        /// <param name="key" type="String">The header to add.</param>
        /// <param name="value" type="String">The value of the header being added.</param>
        
        this._headers.push({ key: key, value: value });
    };

    window.PortableRest.RestClient.prototype.execute = function (restRequest, callback)
    {
        /// <summary>Executes an asynchronous request to the given resource and deserializes the response</summary>
        /// <param name="restRequest" type="window.PortableRest.RestRequest">The RestRequest to execute.</param>
        /// <param name="callback" type="Function" optional="true"></param>
        /// <returns type="Object" />

        var url = restRequest._getFormattedResource(this.baseUrl);

        this._client = new XMLHttpRequest();

        for (var headerIndex = 0, headersLength = this._headers.length; headerIndex < headersLength; headerIndex++)
        {
            var header = this._headers[headerIndex];
            this._client.setRequestHeader(header.key, header.value);
        }

        restRequest._credentials = this._credentials || restRequest._credentials;

        if (restRequest._credentials === null)
        {
            this._client.open(restRequest.method, url, true);
        }
        else
        {
            this._client.open(restRequest.method, url, true, restRequest._credentials.user, restRequest._credentials.password);
        }

        var body = null;

        if ((restRequest.method === window.PortableRest.HttpMethod.Post) || (restRequest.method === window.PortableRest.HttpMethod.Put))
        {
            this._client.setRequestHeader("Content-Type", restRequest._getContentType());
            body = restRequest._getRequestBody();
        }

        var $this = this;
        if ((callback !== undefined) && (callback !== null) && (typeof callback === "Function"))
        {
            this._client.onreadystatechange = function ()
            {
                if ($this._client.readyState === 4)
                {
                    var type = $this._client.getResponseHeader("Content-Type");

                    if ((type.indexOf("application/xml") !== -1) && ($this._client.responseXML !== null) && ($this._client.responseXML !== undefined))
                    {
                        callback($this._client.responseXML.firstChild, $this._client.status);
                    }
                    else if ($this._client.responseText)
                    {
                        callback(JSON.parse($this._client.responseText), $this._client.status);
                    }
                    else
                    {
                        callback(null, $this._client.status);
                    }
                }
            };
        }

        this._client.send(body);
    };

})(window);
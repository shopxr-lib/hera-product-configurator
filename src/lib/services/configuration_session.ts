import { AxiosInstance } from "axios";
import { to } from "../utils";
import { ChoiceMap, FurnitureMap } from "../../store/useStore";

export class ConfigurationSession {
  constructor(private _axios: AxiosInstance) {}

  async get(
    request: GetConfigurationSessionRequest,
  ): Promise<[ParsedGetConfigurationSessionResponse | null, Error | null]> {
    const [res, err] = await to(
      this._axios.post<GetConfigurationSessionResponse>(
        `/configuration-session/get`,
        request,
      ),
    );

    if (err) {
      return [null, err];
    }

    if (!res?.data) {
      return [null, new Error("No data")];
    }

    let parsedConfig: ConfigurationSessionConfig;
    try {
      parsedConfig = JSON.parse(res.data.config);
    } catch (e) {
      return [null, e as Error];
    }

    const parsedResponse = {
      id: res.data.id,
      version: res.data.version,
      config: parsedConfig,
    } satisfies ParsedGetConfigurationSessionResponse;

    return [parsedResponse as ParsedGetConfigurationSessionResponse, null];
  }

  async update(
    request: UpdateConfigurationSessionRequest,
  ): Promise<Error | null> {
    const parsedRequest = {
      session_key: request.session_key,
      product_set_id: request.product_set_id,
      config: JSON.stringify(request.config),
    } satisfies ParsedUpdateConfigurationSessionRequest;

    const [, err] = await to(
      this._axios.post(`/configuration-session/update`, parsedRequest),
    );

    if (err) {
      return err;
    }
    return null;
  }
}

type GetConfigurationSessionRequest = {
  session_key: string;
  product_set_id: number;
};

type GetConfigurationSessionResponse = {
  id: number;
  version: number;
  config: string;
};

type ParsedGetConfigurationSessionResponse = {
  id: number;
  version: number;
  config: ConfigurationSessionConfig;
};

export type ConfigurationSessionConfig = {
  choiceMap: ChoiceMap;
  furnitureMap: FurnitureMap;
};

type UpdateConfigurationSessionRequest = {
  session_key: string;
  product_set_id: number;
  config: ConfigurationSessionConfig;
};

type ParsedUpdateConfigurationSessionRequest = {
  session_key: string;
  product_set_id: number;
  config: string;
};

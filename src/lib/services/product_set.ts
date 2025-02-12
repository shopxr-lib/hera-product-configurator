import { AxiosInstance } from "axios";
import { to } from "../utils";

export class ProductSetService {
  constructor(private _axios: AxiosInstance) {}

  async get(
    request: GetProductSetRequest,
  ): Promise<[GetProductSetResponse | null, Error | null]> {
    const [res, err] = await to(
      this._axios.post<GetProductSetResponse>("/product-set/get", request),
    );
    if (err) {
      return [null, err];
    }

    return [res?.data ?? null, null];
  }
}

type GetProductSetRequest = {
  client_id: number;
};

type GetProductSetResponse = {
  product_sets: ProductSet[];
};

type ProductSet = {
  id: number;
  product_set_key: string;
  name: string;
  logo: string;
};

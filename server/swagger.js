import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
const openapi = YAML.load(new URL("../docs/openapi.yaml", import.meta.url).pathname);

export default function mountSwagger(app) {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openapi));
}
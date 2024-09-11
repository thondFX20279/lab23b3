import feed from "./feed";
import * as controllers from "../controller/index.js";
import auth from "./auth";
const initialRoutes = (app) => {
  app.use("/feed", feed);
  app.use("/auth", auth);
  app.use(controllers.notFound);
  app.use(controllers.handleError);
};
export default initialRoutes;

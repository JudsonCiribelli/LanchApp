import { Router } from "express";
import multer from "multer";
import uploadConfig from "./config/multer.ts";
import { CreateUserController } from "./controllers/user/createUserController.ts";
import { LoginUserController } from "./controllers/user/LoginUserController.ts";
import { IsAuthenticated } from "./middleware/user/IsAutheticated.ts";
import { GetUserController } from "./controllers/user/getUserController.ts";
import { CreateAddressesController } from "./controllers/address/createAddressController.ts";
import { GetAddressController } from "./controllers/address/getAddressController.ts";
import { DeleteAdressController } from "./controllers/address/deleteAddressController.ts";
import { CreateCategoryController } from "./controllers/category/createCategoryController.ts";
import { CreateProductController } from "./controllers/product/createProductController.ts";
import { GetProductController } from "./controllers/product/getProductController.ts";
import { GetProductByIdController } from "./controllers/product/getProductByIdController.ts";

const router = Router();
const upload = multer(uploadConfig.upload("./tmp"));

//User
router.post("/user", new CreateUserController().handle);
router.post("/session", new LoginUserController().handle);
router.get("/user", IsAuthenticated, new GetUserController().handle);
router.post(
  "/user/address",
  IsAuthenticated,
  new CreateAddressesController().handle
);
router.get("/user/address", IsAuthenticated, new GetAddressController().handle);
router.delete(
  "/user/address",
  IsAuthenticated,
  new DeleteAdressController().handle
);
//Category
router.post(
  "/category",
  IsAuthenticated,
  new CreateCategoryController().handle
);
//Product
router.post(
  "/product",
  IsAuthenticated,
  upload.single("file"),
  new CreateProductController().handle
);
router.get("/product", new GetProductController().handle);
router.get("/category/product", new GetProductByIdController().handle);

export { router };

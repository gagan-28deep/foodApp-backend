const express = require("express");

const planRouter = express.Router();
const {
  getAllPLansController,
  createPlanController,
  updatePlanController,
  deletePlanController,
  getPlanController,
} = require("../controller/planController");

const { protectRoute } = require("../controller/authController");

planRouter.route("/").get(getAllPLansController).post(createPlanController);
planRouter
  .route("/:id")
  .patch(updatePlanController)
  .delete(deletePlanController)
  .get(getPlanController);

module.exports = planRouter;

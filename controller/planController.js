const FoodplanModel = require("../model/planModel");

async function getAllPLansController(req, res) {
  try {
    let allPlan = await FoodplanModel.find();
    res.status(200).json({
      allPlan,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}
async function createPlanController(req, res) {
  try {
    let planObj = req.body;
    console.log("7", req.body);
    const { price, duration, discount, name } = req.body;
    // const isObjPresent = Object.keys(planObj).length > 0;
    if (price && duration && discount && name) {
      let newPlan = await FoodplanModel.create(planObj);
      console.log("11", newPlan);
      res.status(201).json({
        result: "Plan Created",
        plan: newPlan,
      });
    } else {
      res.status(404).json({
        message: "Data is Incomplete",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}
async function updatePlanController(req, res) {
  try {
    console.log("41", req.params.id);
    let planUpdatedObjData = req.body;
    let id = req.params.id;
    const isDataPresent = Object.keys(planUpdatedObjData).length > 0;
    if (isDataPresent) {
      // const plan = await FoodplanModel.findById(id)
      // for(let key in planUpdatedObjData[key]){
      // plan[key] = planUpdatedObjData[key]
      // }
      // await plan.save()
      // res.status(200).json({plan})

      const updatedPlan = await FoodplanModel.findByIdAndUpdate(
        id,
        planUpdatedObjData,
        {
          runValidators: true,
          new: true,
        }
      );
      res.status(200).json({
        result: "Plan Updated",
        updatedPlan,
      });
    } else {
      res.status(404).json({
        message: "Nothing to Update",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}
async function deletePlanController(req, res) {
  try {
    let id = req.params.id;
    let plan = await FoodplanModel.findByIdAndDelete(id);
    res.status(200).json({
      result: "Plan Deleted",
      plan,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}
async function getPlanController(req, res) {
  try {
    let id = req.params.id;
    let plan = await FoodplanModel.findById(id);
    res.status(200).json({
      result: "Plan Found",
      plan,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}

module.exports = {
  getAllPLansController,
  createPlanController,
  updatePlanController,
  deletePlanController,
  getPlanController,
};

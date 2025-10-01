import React from 'react'
import { Link } from 'react-router-dom';

const MealPlanCard = ({plan}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-all">
      <h3 className="text-lg sm:text-xl font-semibold mb-2">
        Week of {new Date(plan.weekStart).toLocaleDateString()}
      </h3>
      <p className="text-sm sm:text-base text-gray-600 mb-4">
        {plan.selectedRecipes.length} recipes included
      </p>
      <Link
        to={`/mealplan/${plan._id}`}
        className="text-blue-500 hover:underline text-sm sm:text-base"
      >
        View Details →
      </Link>
    </div>
  );
}

export default MealPlanCard;

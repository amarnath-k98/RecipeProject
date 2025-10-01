import React from 'react'
import { useGetUserDashboardQuery } from '../slices/apiSlice'
import Loading from '../components/Loading';
import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';

const Dashboard = () => {
    const { data, isLoading, isError } = useGetUserDashboardQuery();
    if (isLoading) return <Loading message='Loading dashboard...' />
    if (isError) return (
      <div className="text-center py-10 text-red-500 text-base sm:text-lg md:text-xl">
        Failed to load
      </div>
    );
  const { user, recipes, mealPlans } = data;
  
  console.log("Dashboard recipes:", data?.user?.recipes);
    
  return (
    <>
      <div className="max-w-screen-xl  mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold  mb-6 text-center sm:text-left">
          Welcome, {user?.name}
        </h1>

        <section className="bg-gray-300 shadow-md shadow-gray-600 rounded-lg p-4 sm:p-6 mb-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">My Profile</h2>
          <div className="text-sm sm:text-base space-y-1 ">
            <p>
              <strong>Email:</strong>
              {user?.email}
            </p>
            <p>
              <strong>Bio:</strong>
              {user?.bio || "No bio added yet."}
            </p>
          </div>
        </section>

        <section className="bg-gray-300 shadow-gray-600 shadow-md rounded-lg p-4 sm:p-6 mb-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">My Recipe</h2>
          {recipes?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <p className="text-sm sm:text-base">
              You haven't submitted any recipes yet.{" "}
            </p>
          )}
          <Link
            to="/recipes/new"
            className="inline-block mt-3 text-blue-600 hover:underline text-sm sm:text-base"
          >
            Submit a Recipe
          </Link>
        </section>

        <section className="bg-gray-300 shadow-gray-600 shadow-md rounded-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            My Meal Plans
          </h2>
          {mealPlans?.length > 0 ? (
            <ul className="space-y-4">
              {mealPlans.map((plan) => (
                <li key={plan._id} className="border-b pb-2">
                  <p className="text-base sm:text-lg font-medium">
                    Week of {new Date(plan.weekStart).toLocaleDateString()}
                  </p>
                  <Link
                    to={`/mealPlan/${plan._id}`}
                    className="text-blue-600 hover:underline text-sm sm:text-base"
                  >
                    View Plan
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm sm:text-base">No meal plans created yet.</p>
          )}
          <Link
            to="/mealplan/create"
            className="inline-block mt-3 text-blue-600 hover:underline text-sm sm:text-base"
          >
            Create Meal Plan
          </Link>
        </section>
      </div>
    </>
  );
}

export default Dashboard

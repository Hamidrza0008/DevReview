import Dashboard from "@/Components/DevReviewLayout/Dashboard"

export const metadata = {
  title: "Dashboard",
  description: "Your DevReview dashboard with stats, projects, and activity.",
};

const dashboard = () => {
    return(
        <>
        <Dashboard/>
        </>
    )
}

export default dashboard;
import CreateProjects from "@/Components/DevReviewLayout/CreateProjects"

export const metadata = {
  title: "Create Project",
  description: "Submit a new project for review on DevReview.",
};

const createProject = () => {
    return(
        <>
            <CreateProjects/>
        </>
    )
}

export default createProject;
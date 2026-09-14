import SavedProjects from "@/Components/DevReviewLayout/SavedProjects"

export const metadata = {
  title: "Saved Projects",
  description: "Projects you've bookmarked on DevReview.",
};

const saved = () => {
    return(
        <>
        <SavedProjects/>
        </>
    )
}

export default saved;
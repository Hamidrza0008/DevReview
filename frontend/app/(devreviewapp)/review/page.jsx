import ReviewsReceived from "@/Components/DevReviewLayout/ReviewsReceived"

export const metadata = {
  title: "Reviews Received",
  description: "View code reviews submitted on your projects.",
};

const review = () => {
    return(
        <>
        <ReviewsReceived/>
        </>
    )
}
export default review;
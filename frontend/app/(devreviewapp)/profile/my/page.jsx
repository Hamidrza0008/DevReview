import MyProfile from "@/Components/DevReviewLayout/MyProfile";

export const metadata = {
  title: "My Profile",
  description: "View and edit your DevReview profile.",
};

const profile = () => {
    return(
        <>
        <MyProfile/>
        </>
    )
}

export default profile;
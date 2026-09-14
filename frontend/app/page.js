import DevReviewLandingPage from "./(public)/LandingPage/page";

export const metadata = {
  title: "DevReview — Get Honest Code Reviews from Developers",
  description:
    "Showcase your projects, get honest feedback from real developers, and improve your skills. Join the developer community built for real code review.",
  openGraph: {
    title: "DevReview — Get Honest Code Reviews from Developers",
    description:
      "Showcase your projects, get honest feedback from real developers, and improve your skills.",
    url: "/",
  },
  twitter: {
    title: "DevReview — Get Honest Code Reviews from Developers",
    description:
      "Showcase your projects, get honest feedback from real developers, and improve your skills.",
  },
};

export default function Home() {
  return (
   <>
   <DevReviewLandingPage/>
   </>
  );
}

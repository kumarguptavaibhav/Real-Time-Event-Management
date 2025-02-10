import { jwtDecode } from "jwt-decode";

export const eventTypes = [
  "Conference",
  "Workshop",
  "Webinar",
  "Seminar",
  "Networking Event",
  "Trade Show",
  "Product Launch",
  "Hackathon",
  "Training Session",
  "Panel Discussion",
  "Fundraiser",
  "Award Ceremony",
  "Corporate Event",
  "Cultural Event",
  "Sports Event",
  "Music Concert",
  "Exhibition",
  "Festival",
  "Career Fair",
  "Meetup",
];

export const eventLevels = [
  "Local",
  "Regional",
  "National",
  "International",
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
  "Corporate",
  "Community",
  "Educational",
  "Professional",
  "Exclusive",
  "Public",
  "Private",
];

export const speakerTypes = [
  "Keynote Speaker",
  "Guest Speaker",
  "Panelist",
  "Moderator",
  "Motivational Speaker",
  "Industry Expert",
  "Technical Speaker",
  "Workshop Trainer",
  "Academic Lecturer",
  "Fireside Chat Speaker",
  "Corporate Speaker",
  "Influencer",
  "Thought Leader",
  "Government Representative",
  "Entrepreneur",
];

export const user = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};

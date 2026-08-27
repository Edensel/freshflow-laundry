import { getApprovedFeedback } from "@/lib/feedback";
import { TestimonialCarouselClient, type TestimonialCardData } from "@/components/TestimonialCarouselClient";

const staticTestimonials: TestimonialCardData[] = [
  {
    name: "Ann Kimotho",
    role: "Resident in Kilimani",
    rating: 5,
    text: "Fresh Flow has completely transformed my weekly routine. The driver picks up from my apartment gate on time every Tuesday, and my clothes come back crisp and wonderfully scented.",
    service: "Wash & Fold",
  },
  {
    name: "Dennis Kiptoo",
    role: "Executive in Westlands",
    rating: 5,
    text: "As someone who wears formal suits daily, finding a dry cleaner in Nairobi that handles wool and delicate linings with extreme care was essential. Fresh Flow's ticket tracking is brilliant!",
    service: "Suit Dry Cleaning",
  },
  {
    name: "Alfred Mumbi",
    role: "Homeowner in Lavington",
    rating: 5,
    text: "We sent 5 heavy duvets and comforters for deep cleaning. They returned incredibly fluffy, fresh, and 100% allergen-free. Exceptional service!",
    service: "Bedding & Duvets Care",
  },
  {
    name: "Ken Njogu",
    role: "Resident in Karen",
    rating: 5,
    text: "Super fast 24-hour turnaround. The courier was polite, weighed items at my doorstep, and M-Pesa Buy Goods payment was seamless.",
    service: "Express Wash & Iron",
  },
  {
    name: "Dorcus Kinywa",
    role: "Business Owner in Parklands",
    rating: 5,
    text: "We rely on Fresh Flow for our boutique hotel towels and linen. The route drivers are professional, invoicing is straightforward, and our linens are always pristine.",
    service: "Corporate Linen Contract",
  },
  {
    name: "Luka Owino",
    role: "Resident in Upper Hill",
    rating: 5,
    text: "The live price estimator on the website was 100% accurate, and the ticket status alerts by email kept me updated from collection to final doorstep delivery.",
    service: "Wash & Fold",
  },
  {
    name: "Joshua Mate",
    role: "Resident in Runda",
    rating: 5,
    text: "Top-tier garment care in Nairobi! My designer jackets and shirts came back packaged like brand new garments from an international boutique.",
    service: "Premium Garment Care",
  },
];

export async function TestimonialSlider() {
  const dynamicApproved = await getApprovedFeedback();

  const formattedDynamic: TestimonialCardData[] = dynamicApproved.map((f) => ({
    name: f.customerName,
    role: `Resident in ${f.locationArea}`,
    rating: f.rating,
    text: f.reviewText,
    service: f.serviceType,
  }));

  const allReviews = [...staticTestimonials, ...formattedDynamic];

  return <TestimonialCarouselClient reviews={allReviews} />;
}

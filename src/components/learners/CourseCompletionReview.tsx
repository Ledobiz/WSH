import { useState, useRef, useEffect } from "react";
import { Star, ImagePlus, X, PartyPopper } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { Checkbox } from "@/src/components/ui/checkbox";
import { motion } from "framer-motion";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface CourseCompletionReviewProps {
  courseTitle: string;
  onSubmit: (review: { rating: number; text: string; anonymous: boolean; images: string[] }) => void;
}

const CLAP_AUDIO_URL = "https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3";

const CourseCompletionReview = ({ courseTitle, onSubmit }: CourseCompletionReviewProps) => {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasPlayedEffects = useRef(false);

  useEffect(() => {
    if (hasPlayedEffects.current) return;
    hasPlayedEffects.current = true;

    // Fire confetti bursts
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ["#7c3aed", "#f59e0b", "#10b981", "#ec4899"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ["#7c3aed", "#f59e0b", "#10b981", "#ec4899"],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();

    // Center burst
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.5 },
      colors: ["#7c3aed", "#f59e0b", "#10b981", "#ec4899", "#6366f1"],
    });

    // Play clap/applause audio
    try {
      const audio = new Audio(CLAP_AUDIO_URL);
      audio.volume = 0.5;
      audio.play().catch(() => {});

      setTimeout(() => {
        const congratsAudio = new Audio('/assets/audio/congrat.mp3');
        congratsAudio.volume = 0.95;
        congratsAudio.play().catch(() => {});
      }, 1000)
    } catch {
      // Audio not supported, silently ignore
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      setImages((prev) => [...prev, URL.createObjectURL(file)]);
    });
    e.target.value = "";
  };

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!text.trim()) {
      toast.error("Please write a review");
      return;
    }
    onSubmit({ rating, text, anonymous, images });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card rounded-2xl border-2 border-primary/20 p-5 md:p-8 text-center max-w-lg mx-auto"
    >
      <motion.div
        initial={{ rotate: -20, scale: 0 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 15, delay: 0.2 }}
      >
        <PartyPopper className="h-12 w-12 text-accent mx-auto mb-3" />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-lg md:text-xl font-display font-bold text-foreground mb-1"
      >
        Congratulations! 🎉
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-sm text-muted-foreground mb-6"
      >
        You've completed <strong>{courseTitle}</strong>. We'd love your feedback!
      </motion.p>

      {/* Star rating */}
      <div className="mb-5">
        <p className="text-sm font-medium text-foreground mb-2">Rate this course</p>
        <div className="flex justify-center gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className="transition-transform hover:scale-110 active:scale-95"
            >
              <Star
                className={`h-8 w-8 transition-colors ${
                  star <= rating ? "fill-accent text-accent" : "text-border"
                }`}
              />
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            {rating === 1 && "Poor"}{rating === 2 && "Fair"}{rating === 3 && "Good"}
            {rating === 4 && "Very Good"}{rating === 5 && "Excellent!"}
          </p>
        )}
      </div>

      <div className="text-left space-y-4">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Tell us about your experience..."
          className="min-h-[80px] text-sm"
        />

        {/* Image upload */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">
            Add photos <span className="italic">(optional — you can add them later)</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {images.map((img, i) => (
              <div key={i} className="relative w-14 h-14 rounded-lg overflow-hidden border border-border">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                  className="absolute top-0 right-0 p-0.5 bg-foreground/70 rounded-bl-lg"
                >
                  <X className="h-3 w-3 text-background" />
                </button>
              </div>
            ))}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-14 h-14 rounded-lg border-2 border-dashed border-border flex items-center justify-center hover:border-primary/50 transition-colors"
            >
              <ImagePlus className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="anon-completion"
            checked={anonymous}
            onCheckedChange={(c) => setAnonymous(c === true)}
          />
          <label htmlFor="anon-completion" className="text-sm text-foreground cursor-pointer">
            Submit anonymously
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-6">
        <Button variant="hero" onClick={handleSubmit} className="w-full">
          Submit Review
        </Button>
      </div>
    </motion.div>
  );
};

export default CourseCompletionReview;

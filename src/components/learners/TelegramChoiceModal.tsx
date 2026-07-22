import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { BookOpen, Send } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface TelegramChoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseTitle: string;
  telegramLink: string|null;
  onChooseLMS: () => void;
}

const TelegramChoiceModal = ({
  open,
  onOpenChange,
  courseTitle,
  telegramLink,
  onChooseLMS,
}: TelegramChoiceModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm sm:max-w-md">
        <DialogHeader className="text-center sm:text-center">
          <DialogTitle className="text-lg font-display font-bold text-foreground">
            How would you like to learn?
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{courseTitle}</span> is available on both our Learning Portal and Telegram. Choose your preferred platform.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              className="w-full h-auto flex-col gap-3 py-6 px-4 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all cursor-pointer"
              onClick={onChooseLMS}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground text-sm">Continue on LMS</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 font-normal">
                  Track progress & take notes
                </p>
              </div>
            </Button>
          </motion.div>

          {telegramLink && (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link href={telegramLink} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  className="w-full h-auto flex-col gap-3 py-6 px-4 rounded-xl border-2 border-border hover:border-[#229ED9] hover:bg-[#229ED9]/5 transition-all cursor-pointer"
                  onClick={() => onOpenChange(false)}
                >
                  <div className="w-12 h-12 rounded-xl bg-[#229ED9]/10 flex items-center justify-center">
                    <Send className="h-6 w-6 text-[#229ED9]" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-foreground text-sm">Open in Telegram</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 font-normal">
                      Join the class group
                    </p>
                  </div>
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TelegramChoiceModal;

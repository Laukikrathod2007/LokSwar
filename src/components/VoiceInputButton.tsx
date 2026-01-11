import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface VoiceInputButtonProps {
  isListening: boolean;
  isSupported: boolean;
  onClick: () => void;
  className?: string;
  size?: 'sm' | 'default';
}

export function VoiceInputButton({
  isListening,
  isSupported,
  onClick,
  className,
  size = 'sm',
}: VoiceInputButtonProps) {
  if (!isSupported) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled
              className={cn('h-8 w-8 text-muted-foreground/50', className)}
            >
              <MicOff className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Voice input not supported in this browser</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant={isListening ? 'default' : 'ghost'}
            size="icon"
            onClick={onClick}
            className={cn(
              'h-8 w-8 transition-all',
              isListening && 'bg-destructive hover:bg-destructive/90 animate-pulse',
              className
            )}
          >
            {isListening ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isListening ? 'Stop listening' : 'Click to speak'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

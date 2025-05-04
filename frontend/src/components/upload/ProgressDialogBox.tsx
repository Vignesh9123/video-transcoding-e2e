import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"


function ProgressDialogBox({open, setOpen, progress, abortUpload}:{open: boolean, setOpen: (open: boolean) => void, progress: number, abortUpload: () => void}) {
  return (
<Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Uploading Video</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Please wait while your video is being uploaded...<br/>
            This may take a few minutes. Please do not close the browser or navigate away from this page.
          </DialogDescription>
          <div className="flex items-center justify-center">
            <p className="text-sm text-muted-foreground">{progress.toFixed(2)}%</p>
            <Progress value={progress} />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button onClick={abortUpload} variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>

      </Dialog>
  )
}

export default ProgressDialogBox

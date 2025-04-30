
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface FormatSelectionProps {
  selectedFormats: string[];
  setSelectedFormats: React.Dispatch<React.SetStateAction<string[]>>;
}

const FormatSelection = ({ selectedFormats, setSelectedFormats }: FormatSelectionProps) => {
  const formats = [
    {
      id: "mp4",
      name: "MP4",
      description: "Widely compatible video format supported by most devices and platforms."
    },
    {
      id: "m3u8",
      name: "M3U8 (HLS)",
      description: "HTTP Live Streaming format for adaptive bitrate streaming."
    }
  ];

  const toggleFormat = (format: string) => {
    setSelectedFormats(current =>
      current.includes(format)
        ? current.filter(f => f !== format)
        : [...current, format]
    );
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        Select output formats for your transcoded video.
      </p>
      
      <div className="space-y-3">
        {formats.map(format => (
          <div key={format.id} className="flex items-start space-x-3 rounded-md border p-4">
            <Checkbox
              id={`format-${format.id}`}
              checked={selectedFormats.includes(format.id)}
              onCheckedChange={() => toggleFormat(format.id)}
            />
            <div className="space-y-1">
              <Label 
                htmlFor={`format-${format.id}`}
                className="text-base font-medium cursor-pointer"
              >
                {format.name}
              </Label>
              <p className="text-sm text-muted-foreground">
                {format.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormatSelection;

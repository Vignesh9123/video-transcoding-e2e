
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ResolutionSelectionProps {
  selectedResolutions: string[];
  setSelectedResolutions: React.Dispatch<React.SetStateAction<string[]>>;
}

const ResolutionSelection = ({ selectedResolutions, setSelectedResolutions }: ResolutionSelectionProps) => {
  const resolutions = [
    { id: "144p", name: "144p (SD)", description: "Very Low quality" },
    { id: "240p", name: "240p (SD)", description: "Low definition quality" },
    { id: "360p", name: "360p (SD)", description: "Medium definition quality" },
    { id: "480p", name: "480p (SD)", description: "Standard definition quality" },
    { id: "720p", name: "720p (HD)", description: "High definition quality" },
    { id: "1080p", name: "1080p (Full HD)", description: "Full high definition quality" }
  ];

  const toggleResolution = (resolution: string) => {
    setSelectedResolutions(current =>
      current.includes(resolution)
        ? current.filter(r => r !== resolution)
        : [...current, resolution]
    );
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        Select the resolutions you want for your transcoded video.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resolutions.map(resolution => (
          <div key={resolution.id} className="flex items-start space-x-3 rounded-md border p-4">
            <Checkbox
              id={`resolution-${resolution.id}`}
              checked={selectedResolutions.includes(resolution.id)}
              onCheckedChange={() => toggleResolution(resolution.id)}
            />
            <div className="space-y-1">
              <Label 
                htmlFor={`resolution-${resolution.id}`}
                className="text-base font-medium cursor-pointer"
              >
                {resolution.name}
              </Label>
              <p className="text-sm text-muted-foreground">
                {resolution.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResolutionSelection;

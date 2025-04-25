import createShadow from "@/config/builders/createShadow";
import createTextConfig from "@/config/builders/createTextConfig";

import {
  faCode,
  faLayerGroup,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";

const createInitialState = () => ({
  text: {
    id: "userText",
    value: "Type your text here",
  },
  items: {
    isOpen: false,
    isPinned: false,
    data: {
      generalSettings: {
        id: "generalSettings",
        label: "General settings",
        icon: faSliders,
        isOpen: true,
        isPinned: false,
        data: [createTextConfig()],
      },
      layers: {
        id: "layers",
        label: "Shadow layers",
        icon: faLayerGroup,
        isOpen: false,
        isPinned: false,
        data: [createShadow("initial-layer")],
      },
      output: {
        id: "output",
        label: "Output",
        icon: faCode,
        isOpen: false,
        isPinned: false,
        data: [],
      },
    },
  },
});

export default createInitialState;

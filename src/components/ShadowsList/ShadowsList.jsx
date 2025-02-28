import { useSelector, useDispatch } from "react-redux";

import ShadowStyler from "../ShadowStyler/ShadowStyler";

const ShadowsList = () => {
  const { shadows } = useSelector((store) => store.textSettings);
  return shadows.map((shadow, index) => {
    return <ShadowStyler key={shadow.id} shadow={shadow} index={index} />;
  });
};

export default ShadowsList;

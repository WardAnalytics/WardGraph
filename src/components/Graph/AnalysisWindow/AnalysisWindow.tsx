import React from "react";

import Draggable from "react-draggable";

const DraggableWindow: React.FC = () => {
  return (
    <Draggable bounds="parent">
      <div className="divide-y divide-dashed divide-gray-200 overflow-hidden rounded-lg bg-white shadow transition-all duration-300">
        <div className="px-4 py-5">
          <Header state={state} />
        </div>
        <div className="px-4 py-5">
          <Content />
        </div>
      </div>
    </Draggable>
  );
};

export default DraggableWindow;

import React from "react";


const TextLink = ({text, link, handleClick}) => {
    if (text && link) {
      return (
        <a
          onClick={() => handleClick.left(link)}
          onContextMenu={(e) => { e.preventDefault(); handleClick.right(link); }}
        >
          {text}
        </a>
      );
    } else {
      return null;
    }
};

export default TextLink;

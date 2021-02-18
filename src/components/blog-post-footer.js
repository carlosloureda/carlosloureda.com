import * as React from "react";
import kent from "../images/kent.png";

function BlogFooter() {
  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          paddingRight: 20,
        }}
      >
        <img
          src={kent}
          alt="Carlos Loureda"
          style={{
            maxWidth: 80,
            borderRadius: "50%",
          }}
        />
      </div>
      <p>
        <strong>Carlos Loureda</strong>
        {`
          es un desarrollador Javascript, profesor y mentor. Ha enseñado a cientas de personas como programar, 
          ser exitoso y no morir en el intento. Vive en La Coruña.
        `}
      </p>
    </div>
  );
}

export default BlogFooter;

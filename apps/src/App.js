import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import "./scss/global.scss";
import "./scss/App.scss";

const Homepage = React.lazy(() => import("./pages/Homepage/Homepage"));

const App = () => (
  <Suspense fallback="Loading...">
    <div className="app__coo">
      {/* <h1>Hello World from WKND!</h1>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/test-router">Some Page</Link>
        </li>
      </ul> */}
      <Routes>
        <Route path="/" element={<Homepage />} />
      </Routes>
    </div>
  </Suspense>
);

export default App;

import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import routes from "../routes";
import Navigation from '../components/navigation/Navigation';
import { RoutesType } from "types/routes";
import ResourceShop from "../components/shop/ResourceShop";
import ResourceBar from "@/components/resource/ResourceBar";
import { useAuth } from "@/contexts/AuthContext";

export default function MainLayout() {
  const location = useLocation();
  const [currentRoute, setCurrentRoute] = React.useState("Main Dashboard");
  const [showShop, setShowShop] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    getActiveRoute(routes);
  }, [location.pathname]);

  const getActiveRoute = (routes: RoutesType[]): string | boolean => {
    let activeRoute = "forum";
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(
          routes[i].layout + "/" + routes[i].path
        ) !== -1
      ) {
        setCurrentRoute(routes[i].key);
      }
    }
    return activeRoute;
  };

  const getRoutes = (routes: RoutesType[]): any => {
    return routes.map((prop, key) => {
      if (prop.layout === "") {
        return (
          <Route path={`/${prop.path}`} element={prop.component} key={key} />
        );
      } else {
        return null;
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <ResourceBar />
      {/* Main Content */}
      <main
        className="container mx-auto px-4 py-20"
      >
        <Routes>
          {getRoutes(routes)}
        </Routes>
      </main>
      <Navigation
        selectedSection={currentRoute}
        onOpenShop={() => setShowShop(true)} onSectionChange={(section: string) => navigate('/' + section) } />

      {showShop && (
        <ResourceShop
            onClose={() => setShowShop(false)}
        />
      )}
    </div>
  );
}

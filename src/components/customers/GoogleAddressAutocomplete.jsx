import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

const GOOGLE_SCRIPT_ID = "google-maps-places-script";

const loadGoogleMapsScript = (apiKey) => {
  return new Promise((resolve, reject) => {
    if (window.google?.maps?.places) {
      resolve(window.google);
      return;
    }

    const existingScript = document.getElementById(GOOGLE_SCRIPT_ID);
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.google));
      existingScript.addEventListener("error", reject);
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_SCRIPT_ID;
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.onload = () => resolve(window.google);
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

const getComponent = (components, type, format = "long_name") => {
  const item = components?.find((component) => component.types.includes(type));
  return item?.[format] || "";
};

const parseGooglePlace = (place) => {
  const components = place?.address_components || [];

  const streetNumber = getComponent(components, "street_number");
  const route = getComponent(components, "route");
  const suburb =
    getComponent(components, "locality") ||
    getComponent(components, "postal_town") ||
    getComponent(components, "sublocality") ||
    getComponent(components, "administrative_area_level_2");

  return {
    AddressLine1: [streetNumber, route].filter(Boolean).join(" ") || place?.name || "",
    City: suburb,
    State: getComponent(components, "administrative_area_level_1", "short_name"),
    Postcode: getComponent(components, "postal_code"),
    Country: getComponent(components, "country"),
    GooglePlaceId: place?.place_id || "",
    FormattedAddress: place?.formatted_address || "",
    Latitude: place?.geometry?.location?.lat?.() || null,
    Longitude: place?.geometry?.location?.lng?.() || null,
  };
};

export default function GoogleAddressAutocomplete({
  label = "Search Address",
  placeholder = "Start typing an address...",
  onAddressSelected,
  error,
}) {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      setLoadError("Google Maps API key is missing. Add VITE_GOOGLE_MAPS_API_KEY to .env.");
      return;
    }

    let listener;

    loadGoogleMapsScript(apiKey)
      .then((google) => {
        if (!inputRef.current || autocompleteRef.current) return;

        autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
          componentRestrictions: { country: "au" },
          fields: ["address_components", "formatted_address", "geometry", "name", "place_id"],
          types: ["address"],
        });

        listener = autocompleteRef.current.addListener("place_changed", () => {
          const place = autocompleteRef.current.getPlace();
          const parsedAddress = parseGooglePlace(place);
          onAddressSelected?.(parsedAddress);
        });
      })
      .catch(() => {
        setLoadError("Unable to load Google Places address search.");
      });

    return () => {
      if (listener) listener.remove();
    };
  }, [onAddressSelected]);

  return (
    <div className="space-y-1 md:col-span-2">
      <label className="text-black text-[14px]">{label}</label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          className={`w-full rounded-lg border bg-white py-3 pl-10 pr-4 text-sm text-black focus:border-gray-400 focus:outline-none focus:ring-0 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />
      </div>
      {loadError && <p className="text-xs text-red-500">{loadError}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
      <p className="text-xs text-gray-500">
        Select an address from Google to auto-fill street, suburb/city, state and postcode.
      </p>
    </div>
  );
}

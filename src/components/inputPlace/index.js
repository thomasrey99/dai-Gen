"use client";

import { Input } from "@heroui/input";
import { useEffect, useRef, useState } from "react";

export default function AddressAutocomplete({ value, setValue }) {
    const inputRef = useRef(null);
    const [selected, setSelected] = useState("");

    useEffect(() => {
        const loadScript = (url) => {
            // Evitar múltiples inserciones del mismo script
            const existingScript = document.querySelector(`script[src="${url}"]`);
            if (existingScript) return;

            const script = document.createElement("script");
            script.src = url;
            script.async = true;
            document.head.appendChild(script);
        };

        const scriptUrl = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_MAPS_API_KEY}&libraries=places`;
        loadScript(scriptUrl);

        const buenosAiresProvinceBounds = {
            north: -33.0,
            south: -41.0,
            east: -56.0,
            west: -63.0,
        };

        const initAutocomplete = () => {
            if (!inputRef.current || !window.google) return;

            const bounds = new window.google.maps.LatLngBounds(
                new window.google.maps.LatLng(
                    buenosAiresProvinceBounds.south,
                    buenosAiresProvinceBounds.west
                ),
                new window.google.maps.LatLng(
                    buenosAiresProvinceBounds.north,
                    buenosAiresProvinceBounds.east
                )
            );

            const autocomplete = new window.google.maps.places.Autocomplete(
                inputRef.current,
                {
                    types: ["geocode"],
                    bounds,
                    strictBounds: true,
                }
            );

            autocomplete.setFields(["place_id"]);

            autocomplete.addListener("place_changed", async () => {
                const place = autocomplete.getPlace();
                if (place.place_id) {
                    try {
                        const details = await getPlaceDetails(place.place_id);
                        const formattedAddress = await getFormattedAddress(details);
                        setSelected(formattedAddress);
                        setValue({ target: { name: "placeId", value: place.place_id } });
                    } catch (error) {
                        console.error("Error al obtener los detalles del lugar:", error);
                    }
                }
            });
        };

        const getPlaceDetails = async (placeId) => {
            const service = new window.google.maps.places.PlacesService(
                document.createElement("div")
            );
            return new Promise((resolve, reject) => {
                service.getDetails(
                    {
                        placeId,
                        fields: ["address_components", "place_id"],
                    },
                    (place, status) => {
                        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                            resolve(place);
                        } else {
                            reject(status);
                        }
                    }
                );
            });
        };

        const getFormattedAddress = (place) => {
            const components = place.address_components;

            const intersection = components.find((comp) =>
                comp.types.includes("intersection")
            );
            if (intersection) return intersection.short_name;

            const route = components.find((comp) =>
                comp.types.includes("route")
            );
            const streetNumber = components.find((comp) =>
                comp.types.includes("street_number")
            )?.short_name;

            if (route && streetNumber) {
                return `${route.short_name} ${streetNumber}`;
            }

            if (route) return route.short_name;

            return "";
        };

        const interval = setInterval(() => {
            if (
                window.google?.maps &&
                inputRef.current &&
                !inputRef.current.autocompleteInitialized
            ) {
                initAutocomplete();
                inputRef.current.autocompleteInitialized = true;
                clearInterval(interval);
            }
        }, 300);

        return () => clearInterval(interval);
    }, [setValue]);

    useEffect(() => {
        setValue({ target: { name: "direction", value: selected } });
    }, [selected]);

    return (
        <Input
            ref={inputRef}
            name="direction"
            value={value}
            onChange={setValue}
            type="text"
            placeholder="Buscar dirección en Buenos Aires"
            className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
        />
    );
}

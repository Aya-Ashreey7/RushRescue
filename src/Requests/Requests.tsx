import {
  Box,
  Card,
  CardContent,
  Chip,
  Collapse,
  Divider,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { DollarSign, MapPin, Phone, User as UserIcon } from "lucide-react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { db } from ".././firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import Loader from "../components/Loader";

interface Location {
  lat: number;
  lng: number;
}

interface User {
  fName: string;
  lName: string;
  phone: string;
  email: string;
}

interface Offer {
  comment: string;
  price: number;
  rescuerId: string;
  rescuerData?: User;
}

interface Request {
  id: string;
  comment: string;
  createdAt: string;
  current_location: Location;
  destination: Location;
  driverId: string;
  rescuerId?: string;
  issue: string;
  price: number;
  rescuer_current_location?: Location;
  status: number;
  driverData?: User;
  rescuerData?: User;
  offers: Offer[];
}

const AllRequestsPage = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [expandedOffers, setExpandedOffers] = useState<{
    [id: string]: boolean;
  }>({});
  const [loading, setLoading] = useState(true);

  const toggleOffers = (requestId: string) => {
    setExpandedOffers((prev) => ({
      ...prev,
      [requestId]: !prev[requestId],
    }));
  };

  const fetchRequests = async () => {
    const querySnapshot = await getDocs(collection(db, "requests"));
    const requestsData: Request[] = [];

    for (const docSnap of querySnapshot.docs) {
      const data = docSnap.data() as Request;

      let driverData: User | undefined;
      if (data.driverId) {
        const driverDoc = await getDoc(doc(db, "users", data.driverId));
        driverData = driverDoc.exists()
          ? (driverDoc.data() as User)
          : undefined;
      }

      let rescuerData: User | undefined;
      if (data.rescuerId) {
        const rescuerDoc = await getDoc(doc(db, "users", data.rescuerId));
        rescuerData = rescuerDoc.exists()
          ? (rescuerDoc.data() as User)
          : undefined;
      }

      const offersWithUserData = await Promise.all(
        (data.offers || []).map(async (offer) => {
          let rescuerData;
          if (offer.rescuerId) {
            const rescuerDoc = await getDoc(doc(db, "users", offer.rescuerId));
            rescuerData = rescuerDoc.exists()
              ? (rescuerDoc.data() as User)
              : undefined;
          }
          return { ...offer, rescuerData };
        })
      );

      requestsData.push({
        ...data,
        id: docSnap.id,
        driverData,
        rescuerData,
        offers: offersWithUserData,
      });
    }

    setRequests(requestsData);
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const statusColors: {
    [key: number]: "default" | "primary" | "success" | "warning" | "error";
  } = {
    0: "default",
    1: "warning",
    2: "success",
  };

  const statusText: { [key: number]: string } = {
    0: "Pending",
    1: "In Progress",
    2: "Completed",
  };

  return (
    <Box className="p-4">
      <Typography variant="h4" gutterBottom>
        All Requests
      </Typography>

      {loading ? (
        <Loader />
      ) : (
        requests.map((request) => (
          <Card key={request.id} className="mb-4">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Request #{request.id}
              </Typography>

              <Chip
                label={statusText[request.status] || "Unknown"}
                color={statusColors[request.status] || "default"}
                variant="outlined"
                sx={{ mb: 1 }}
              />

              <Typography variant="body1" color="text.secondary">
                {request.issue} - {request.comment}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Box display="flex" gap={2}>
                <MapPin size={18} />
                <Typography>
                  <strong>Current Location:</strong>{" "}
                  {request.current_location.lat}, {request.current_location.lng}
                </Typography>
              </Box>
              <Box display="flex" gap={2}>
                <MapPin size={18} />
                <Typography>
                  <strong>Destination:</strong> {request.destination.lat},{" "}
                  {request.destination.lng}
                </Typography>
              </Box>

              {request.driverData && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" fontWeight={600}>
                    Driver Info
                  </Typography>
                  <Box display="flex" gap={1} alignItems="center">
                    <UserIcon size={16} />
                    <Typography>
                      {request.driverData.fName} {request.driverData.lName}
                    </Typography>
                  </Box>
                  <Box display="flex" gap={1} alignItems="center">
                    <Phone size={16} />
                    <Typography>{request.driverData.phone}</Typography>
                  </Box>
                </>
              )}

              {request.rescuerData && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" fontWeight={600}>
                    Rescuer Info
                  </Typography>
                  <Box display="flex" gap={1} alignItems="center">
                    <UserIcon size={16} />
                    <Typography>
                      {" "}
                      {request.rescuerData.fName} {request.rescuerData.lName}
                    </Typography>
                  </Box>
                  <Box display="flex" gap={1} alignItems="center">
                    <Phone size={16} />
                    <Typography>{request.rescuerData.phone}</Typography>
                  </Box>
                </>
              )}

              {request.offers.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ cursor: "pointer" }}
                    onClick={() => toggleOffers(request.id)}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      Offers ({request.offers.length})
                    </Typography>
                    {expandedOffers[request.id] ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </Box>

                  <Collapse
                    in={expandedOffers[request.id]}
                    timeout="auto"
                    unmountOnExit
                  >
                    {request.offers.map((offer, i) => (
                      <Box
                        key={i}
                        mt={2}
                        p={2}
                        border={1}
                        borderColor="grey.300"
                        borderRadius={2}
                      >
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Box>
                            <Typography fontWeight={600}>
                              {offer.rescuerData?.fName || "Unknown"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {offer.rescuerData?.email}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <DollarSign size={16} />
                            <Typography>{offer.price} EGP</Typography>
                          </Box>
                        </Box>
                        {offer.comment && (
                          <Typography
                            mt={1}
                            fontStyle="italic"
                            color="text.secondary"
                          >
                            "{offer.comment}"
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Collapse>
                </>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default AllRequestsPage;

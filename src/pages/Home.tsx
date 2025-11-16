import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useInfiniteQuery } from "@tanstack/react-query";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import AddEditModal from "./AddEditModal";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { toast } from "sonner";
import "../App.css";

interface MediaItem {
  id: number;
  title: string;
  type: string;
  director?: string;
  budget?: string;
  location?: string;
  duration?: string;
  yearTime?: string;
  posterUrl?: string;
  details?: string;
}

interface MediaResponse {
  data: MediaItem[];
  meta: { total: number; page: number; limit: number };
}

const PAGE_LIMIT = 8;

const Home: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState<MediaItem | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const { data, fetchNextPage, hasNextPage, isLoading, refetch } =
    useInfiniteQuery<MediaResponse>({
      queryKey: ["media", search, type],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await api.get<MediaResponse>(`/media`, {
          params: { page: pageParam, limit: PAGE_LIMIT, search, type },
        });
        return res.data;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, pages) => {
        const total = lastPage.meta.total;
        const fetched = pages.reduce((acc, p) => acc + p.data.length, 0);
        return fetched < total ? pages.length + 1 : undefined;
      },
    });

  const mediaList = data?.pages.flatMap((page) => page.data) || [];

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/media/${id}`);
      toast.success("Movie/TV Show deleted");
      refetch();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Error while deleting");
    }
  };

  const handleEdit = (item: MediaItem) => {
    setEditData(item);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditData(null);
  };

  return (
    <div className="min-h-screen bg-[url('./assets/3257640.jpg')] bg-cover bg-center text-white">

      {/* Header */}
      <header className="flex flex-col justify-center items-center py-16">
        <h1 className="text-5xl font-extrabold text-purple-400 mb-2 font-style">
          CineVault
        </h1>
        <p className="text-gray-300 text-lg max-w-3xl mt-2 mb-8 text-center tracking-[2px] text-[1.5rem]">
          Your personal collection of favorite movies and TV shows
        </p>

        <div className="flex flex-col items-center gap-3">
          {isAuthenticated ? (
            <>
              <p className="text-gray-200 text-[1.5rem] tracking-[1.2px]">
                Welcome,{" "}
                <span className="text-purple-400 font-semibold">
                  {user?.name || "User"}
                </span>
              </p>

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setEditData(null);
                    setOpenModal(true);
                  }}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  + Add New Entry
                </Button>

                <AddEditModal
                  open={openModal}
                  onClose={handleCloseModal}
                  onSuccess={() => refetch()}
                  editData={editData}
                />

                <Button
                  variant="secondary"
                  onClick={logout}
                  className="bg-gray-200 hover:bg-gray-300"
                >
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => setShowRegister(true)}
                className="bg-purple-600 hover:bg-purple-700 px-6"
              >
                Register
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowLogin(true)}
                className="hover:bg-gray-300 px-6"
              >
                Login
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Modals */}
      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
      <RegisterModal open={showRegister} onClose={() => setShowRegister(false)} />

      {/* Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-10 bg-black/70 backdrop-blur-lg rounded-2xl mt-8 shadow-xl border border-gray-800">

        {/* Search + Filter — ALWAYS visible */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Search title or director..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 rounded-lg bg-gray-800/70 border border-purple-700/40 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none shadow-[0_0_10px_rgba(168,85,247,0.4)] hover:shadow-[0_0_15px_rgba(168,85,247,0.6)] backdrop-blur-md transition"
            />

            <Select
              value={type || "all"}
              onValueChange={(val) => setType(val === "all" ? "" : val)}
            >
              <SelectTrigger className="w-40 px-4 py-5 bg-gray-800/70 border border-purple-700/40 text-white rounded-lg shadow-[0_0_10px_rgba(168,85,247,0.4)] hover:shadow-[0_0_15px_rgba(168,85,247,0.6)] backdrop-blur-md cursor-pointer">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>

              <SelectContent className="bg-gray-900/90 backdrop-blur-md border border-purple-600/40 text-white rounded-lg shadow-xl">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Movie">Movies</SelectItem>
                <SelectItem value="TV Show">TV Shows</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={() => refetch()}
              className="bg-purple-600 hover:bg-purple-700 text-md px-6 py-5 transition"
            >
              Search
            </Button>
          </div>
        </div>

        {/* Results Section */}
        {isLoading ? (
          <p className="text-center text-gray-400 py-10">Loading...</p>
        ) : mediaList.length > 0 ? (
          <InfiniteScroll
            dataLength={mediaList.length}
            next={() => fetchNextPage()}
            hasMore={!!hasNextPage}
            loader={<p className="text-center text-gray-500">Loading more...</p>}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-300">
                <thead>
                  <tr className="border-b border-gray-700 text-purple-300">
                    <th>Title</th>
                    <th>Type</th>
                    <th>Director</th>
                    <th>Budget</th>
                    <th>Location</th>
                    <th>Duration</th>
                    <th>Year/Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {mediaList.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`border-b border-gray-800 transition-all 
                        ${
                          index % 2 === 0
                            ? "bg-gray-900/40 hover:bg-gray-700/60"
                            : "bg-gray-700/30 hover:bg-gray-700/60"
                        }`}
                    >
                      <td className="py-2 text-center text-white font-semibold">
                        {item.title}
                      </td>
                      <td className="py-2 text-center">
                        {item.type === "Movie" ? "🎬 Movie" : "📺 TV Show"}
                      </td>
                      <td className="py-2 text-center">{item.director}</td>
                      <td className="py-2 text-center">{item.budget}</td>
                      <td className="py-2 text-center">{item.location}</td>
                      <td className="py-2 text-center">{item.duration}</td>
                      <td className="py-2 text-center">{item.yearTime}</td>

                      <td className="py-2 text-center">
                        <div className="flex gap-2 justify-center">
                          {/* Edit Button */}
                          <Button
                            size="sm"
                            variant="outline"
                            className="p-4 border-purple-600 bg-purple-700/20 text-purple-400"
                            onClick={() => handleEdit(item)}
                          >
                            <Pencil size={15} />
                          </Button>

                          {/* Delete Button */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                className="px-5 border-red-500 bg-red-700/20 text-red-400"
                              >
                                <Trash2 size={15} />
                              </Button>
                            </AlertDialogTrigger>

                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>

                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <Button onClick={() => handleDelete(item.id)}>
                                  Continue
                                </Button>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </InfiniteScroll>
        ) : (
          <p className="text-center text-gray-400 py-10">No items to show</p>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-200 py-6">❤️ CineVault</footer>
    </div>
  );
};

export default Home;

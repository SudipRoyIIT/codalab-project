import create from "zustand";

const useNewsStore = create((set, get) => ({
  news: [],
  isLoading: false,

  fetchNews: async () => {
    if (get().news.length) return; // prevent refetch

    set({ isLoading: true });
    try {
      const res = await fetch(import.meta.env.VITE_NEWS_API_URL);
      const data = await res.json();
      set({ news: data, isLoading: false });
    } catch (err) {
      console.error(err);
      set({ isLoading: false });
    }
  },
}));

export default useNewsStore;
import create from 'zustand';

const useNewsStore = create((set) => ({
  news: [],
  topNews: [],
  singleNews: null,
  userNews: [],
  loading: false,
  error: null,

  setNews: (news) => set({ news }),
  setTopNews: (topNews) => set({ topNews }),
  setSingleNews: (singleNews) => set({ singleNews }),
  setUserNews: (userNews) => set({ userNews }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));

export default useNewsStore;

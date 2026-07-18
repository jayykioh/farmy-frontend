import { fireEvent, render, screen } from "@testing-library/react";
import { SnapCard } from "./SnapCard";
import type { FarmSnap } from "../types/farmSnap";

const navigateMock = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => navigateMock,
}));

const snap: FarmSnap = {
  id: "snap-1",
  userId: "user-1",
  userName: "Anh Năm",
  userAvatar: "https://example.com/avatar.png",
  imageUrl: "/uploads/rice.webp",
  caption: "Lá lúa có đốm vàng",
  cropType: "Lúa",
  condition: "issue",
  location: { lat: 10, lng: 106, province: "Long An" },
  capturedAt: "2026-07-18T08:00:00.000Z",
  xpEarned: 5,
  reactions: [
    { type: "like", count: 0, userReacted: false },
    { type: "helpful", count: 0, userReacted: false },
    { type: "worry", count: 0, userReacted: false },
  ],
  commentCount: 0,
  createdAt: "2026-07-18T08:00:00.000Z",
};

describe("SnapCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("opens chat with snap image context when asking AI", () => {
    render(<SnapCard snap={snap} />);

    fireEvent.click(screen.getByRole("button", { name: "Hỏi AI" }));

    expect(navigateMock).toHaveBeenCalledWith("/chat/active", {
      state: {
        initialMessage: "Bạn có thể phân tích bức ảnh này giúp tôi được không?",
        initialImage: "http://localhost:3000/uploads/rice.webp",
      },
    });
  });
});

import { useAsBind } from "./";
import { renderHook, act } from "@testing-library/react-hooks";

// mock timer using jest
jest.useFakeTimers();

describe("useAsBind when the source is a string", () => {
  it("updates every second", async () => {
    const { result } = renderHook(() => useAsBind(""));

    expect(result.current).toBe(0);

    // Fast-forward 1sec
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Check after total 1 sec
    expect(result.current).toBe(1);

    // Fast-forward 1 more sec
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Check after total 2 sec
    expect(result.current).toBe(2);
  });

});

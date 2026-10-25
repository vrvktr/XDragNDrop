import React, { useState } from "react";

const INITIAL_DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function App() {
  const [digits, setDigits] = useState(INITIAL_DIGITS);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  function handleDragStart(event, index) {
    setDraggedIndex(index);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(index));
  }

  function handleDragOver(event, index) {
    // Required to allow a drop on this digit box.
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";

    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  }

  function handleDrop(event, targetIndex) {
    event.preventDefault();

    const transferredIndex = event.dataTransfer.getData("text/plain");
    const sourceIndex =
      transferredIndex === "" ? draggedIndex : Number(transferredIndex);

    if (
      sourceIndex === null ||
      sourceIndex === undefined ||
      Number.isNaN(sourceIndex) ||
      sourceIndex < 0 ||
      sourceIndex >= digits.length ||
      sourceIndex === targetIndex
    ) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    // Remove the dragged digit, then insert it at the target slot.
    // This shifts the digits in between instead of swapping two values.
    setDigits((currentDigits) => {
      const nextDigits = [...currentDigits];
      const [movedDigit] = nextDigits.splice(sourceIndex, 1);
      nextDigits.splice(targetIndex, 0, movedDigit);
      return nextDigits;
    });

    setDraggedIndex(null);
    setDragOverIndex(null);
  }

  function handleDragEnd() {
    setDraggedIndex(null);
    setDragOverIndex(null);
  }

  return (
    <main className="app-shell container-fluid d-flex align-items-center justify-content-center">
      <section
        className="digits-card card border-0"
        aria-labelledby="page-title"
      >
        <header className="card-heading text-center">
          <h1 id="page-title">Drag &amp; Drop Digits</h1>
          <p>Drag the boxes to reorder the digits 0–9.</p>
        </header>

        <div
          className="digits-grid"
          aria-label="Digits 0 through 9. Drag a box onto another box to move it."
        >
          {digits.map((digit, index) => {
            const isDragging = draggedIndex === index;
            const isDropTarget =
              dragOverIndex === index && draggedIndex !== index;

            return (
              <div
                className={[
                  "digit-box",
                  isDragging ? "is-dragging" : "",
                  isDropTarget ? "is-drop-target" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                key={digit}
                draggable
                onDragStart={(event) => handleDragStart(event, index)}
                onDragOver={(event) => handleDragOver(event, index)}
                onDrop={(event) => handleDrop(event, index)}
                onDragEnd={handleDragEnd}
                aria-label={`Digit ${digit}, position ${index + 1}`}
              >
                {digit}
              </div>
            );
          })}
        </div>

        <footer className="card-tip text-center">
          Tip: Try reordering to make <code>0123456789</code> or reverse it!
        </footer>
      </section>
    </main>
  );
}

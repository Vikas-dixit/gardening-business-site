export function Footer() {
  return (
    <footer
      style={{
        marginTop: "2rem",
        padding: "1.2rem 2rem",
        backgroundColor: "var(--green-800)",
        color: "var(--text-light)",
        textAlign: "center"
      }}
    >
      <p style={{ margin: 0 }}>© {new Date().getFullYear()} Green Haven Gardening</p>
    </footer>
  );
}

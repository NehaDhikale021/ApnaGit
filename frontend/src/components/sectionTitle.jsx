function SectionTitle({ title, highlight }) {
  return (
    <div className="text-center mb-14">
      <h2 className="text-4xl md:text-5xl font-bold">
        {title}{" "}
        <span className="text-green-500">{highlight}</span>
      </h2>
    </div>
  );
}

export default SectionTitle;
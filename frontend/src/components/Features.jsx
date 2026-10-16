import SectionTitle from "./SectionTitle";

function Features() {
  const features = [
    {
        icon: "📁",
        title: "Repository Management",
        description: "Create, organize and manage repositories easily.",
    },
    {
        icon: "📝",
        title: "Commit Tracking",
        description: "View complete commit history and monitor project progress.",
    },
    {
        icon: "🚀",
        title: "Push & Pull",
        description: "Synchronize repositories seamlessly with the ApnaGit server.",
    },
];

  return (
    <section
        id="features"
        className="bg-black text-white py-20 px-8"
    >
    <SectionTitle
        title="Why Choose"
        highlight="ApnaGit"
    />


      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-lg
                        hover:-translate-y-2 hover:border-green-500 hover:shadow-green-500/20
                        transition-all duration-300"
            >
            <div className="text-5xl mb-5">
                {feature.icon}
            </div>
            <h3 className="text-2xl font-semibold text-green-500 mb-4">
              {feature.title}
            </h3>

            <p className="text-gray-400 leading-7">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
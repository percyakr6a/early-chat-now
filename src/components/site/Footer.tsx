import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="bg-navy text-primary-foreground">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10">
        <p className="label-mono text-lime">SRF / CMC / 2026</p>
        <h2 className="mt-6 max-w-3xl text-4xl leading-[0.95] md:text-6xl">
          Student Research Forum,
          <br />
          Chandka Medical College.
        </h2>
        <div className="mt-12 flex flex-wrap gap-x-10 gap-y-3 text-sm font-semibold">
          <Link to="/about" className="hover:text-lime">About</Link>
          <Link to="/members" className="hover:text-lime">Members</Link>
          <Link to="/projects" className="hover:text-lime">Projects</Link>
          <Link to="/journal" className="hover:text-lime">Journal</Link>
          <a href="mailto:srf.cmc@forum.edu" className="hover:text-lime">srf.cmc@forum.edu</a>
        </div>
        <p className="label-mono mt-12 text-primary-foreground/60">
          CMC LARKANA / STUDENT-LED / RESEARCH-ORIENTED
        </p>
      </div>
    </footer>
  );
}

import ComposeForm from "@/components/ComposeForm";
import { ROUTES, totalKm } from "@/lib/routes";

export default function Home() {
  const routes = ROUTES.map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    days: r.days,
    km: totalKm(r),
    from: r.stops[0].name,
    to: r.stops[r.stops.length - 1].name,
  }));
  return (
    <>
      <h1>Acele etmeyen mektuplar</h1>
      <p className="lead">
        Yazdığın mektup tarihi bir yolda kervan, ulak ya da yelkenliyle yol alır. Her durakta bir mühür toplar ve
        günler sonra varır. Beklemek de mektubun bir parçası.
      </p>
      <ComposeForm routes={routes} />
    </>
  );
}

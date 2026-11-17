import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Building2, MapPin, ShieldCheck } from "lucide-react";
import { ImageGallery } from "../../components/superadmin/ImageGallery";
import { InquiryForm } from "../../components/public/InquiryForm";
import { publicApi } from "../../context/public/publicApi";
import { useRequest } from "../../context/hooks";
import { DetailList, ErrorState, LoadingState, Notice } from "../../components/dashboard/ui";
import { naira } from "../../utils/format";
import { Reveal } from "../../components/ui/Reveal";

/** /properties/:propertyId (GET /public/properties/:id) with the inquiry form. */
export default function PropertyDetailPage() {
  const { propertyId } = useParams();
  const { data: p, loading, error, reload } = useRequest(publicApi.getProperty, propertyId);

  return (
    // MainLayout already renders the Navbar, Footer and <main>
    <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 xl:px-0">
        {/* relative="path" + ".." drops the last URL part: works under /properties and /salespartner/properties */}
        <Link to=".." relative="path" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline">
          <ArrowLeft className="h-4 w-4" /> All properties
        </Link>

        {loading && !p ? (
          <LoadingState label="Loading property…" />
        ) : error && !p ? (
          <div className="mt-6">
            <ErrorState message={/not found/i.test(error) ? "This property isn't available any more." : error} onRetry={reload} />
          </div>
        ) : (
          <>
            <Reveal className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm text-body">{p.propertyType}</p>
                <h1 className="mt-1 text-4xl font-semibold tracking-tight text-ink">{p.name}</h1>
                <p className="mt-2 flex items-center gap-1.5 text-body">
                  <MapPin className="h-4 w-4" aria-hidden /> {p.address || p.location}
                </p>
              </div>
              <div className="sm:text-right">
                <p className="text-sm text-body">Price per plot</p>
                <p className="text-3xl font-semibold text-brand-600">{p.price ? naira(p.price) : "Price on request"}</p>
              </div>
            </Reveal>

            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
              <div className="min-w-0 space-y-8">
                <Reveal delay={100}>
                  <ImageGallery images={p.images} title={p.name} caption="Photos" />
                </Reveal>

                <Reveal as="section" className="rounded-2xl border border-line bg-white p-6">
                  <h2 className="text-lg font-semibold text-ink">Property details</h2>
                  <div className="mt-5">
                    <DetailList
                      columns={3}
                      items={[
                        { label: "Property type", value: p.propertyType },
                        { label: "Plot size", value: p.plotSize },
                        { label: "Plots available", value: p.plotsAvailable },
                        { label: "Title document", value: p.title },
                        { label: "City", value: p.city },
                        { label: "State", value: p.state },
                      ]}
                    />
                  </div>
                  {p.description && <p className="mt-6 whitespace-pre-line text-sm leading-6 text-body">{p.description}</p>}
                </Reveal>

                <Reveal>
                  <Notice title="Reviewed before listing">
                    Landify checks each company and its documents before a property goes live. Always inspect the land and confirm the title before you pay.
                  </Notice>
                </Reveal>
              </div>

              {/* Reveal goes INSIDE the sticky aside: a transform on the aside itself would stop it sticking */}
              <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
                <Reveal from="right" delay={200} className="space-y-4">
                  <section className="rounded-2xl border border-line bg-white p-6">
                    <h2 className="text-lg font-semibold text-ink">Interested in this property?</h2>
                    {p.companyName && (
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-body">
                        <Building2 className="h-4 w-4" aria-hidden /> Listed by {p.companyName}
                      </p>
                    )}
                    <div className="mt-5">
                      <InquiryForm key={p.id} property={p} />
                    </div>
                  </section>
                  <p className="flex items-center gap-2 text-xs text-body">
                    <ShieldCheck className="h-4 w-4 text-brand-600" aria-hidden /> We never ask you to pay through an inquiry.
                  </p>
                </Reveal>
              </aside>
            </div>
          </>
        )}
    </div>
  );
}
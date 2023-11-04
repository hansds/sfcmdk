import { BookmarkIcon, UserIcon, ListIcon } from "@sfcmdk/extension";

export default function Features() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 xl:px-6">
      <h3 className="text-2xl text-center font-bold md:text-3xl lg:text-4xl">
        What does it do?
      </h3>
      <p className="mt-3 text-center font-semibold md:text-md lg:text-lg text-zinc-800 dark:text-zinc-300">
        Work and navigate faster in Salesforce by leveraging the command palette
      </p>
      <div className="relative mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          title="Faster navigation"
          description="Quickly access all setup items, objects and more from a single shortcut. Inspect records and metadata with ease."
          icon={<BookmarkIcon />}
        ></FeatureCard>
        <FeatureCard
          title="Login as users"
          description="Easily login as other users without having to look them up in the user list."
          icon={<UserIcon />}
        ></FeatureCard>
        <FeatureCard
          title={
            <span>
              <span>Integrate your docs</span>
              <span className="bg-purple-600 text-gray-100 text-xs font-medium mr-2 px-2.5 py-1 rounded ml-2">
                Coming soon
              </span>
            </span>
          }
          description="Soon you'll be able to build your own Salesforce documentation. Users will be able to search for documentation and get help right from the command palette."
          icon={<ListIcon />}
        ></FeatureCard>
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string | JSX.Element;
  description: string | JSX.Element;
  icon?: JSX.Element;
}) {
  return (
    <div className="flex h-full flex-col gap-6 rounded-2xl p-8  bg-opacity-60 bg-white dark:bg-black backdrop-filter backdrop-blur-md">
      <div className="[&>*]:w-8 [&>*]:h-auto">{icon}</div>
      <div>
        <h4 className="text-xl font-semibold text-zinc-900 dark:text-white">
          {title}
        </h4>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">{description}</p>
      </div>
    </div>
  );
}

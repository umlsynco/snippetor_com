// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#ifndef WEBLAYER_BROWSER_BROWSER_IMPL_H_
#define WEBLAYER_BROWSER_BROWSER_IMPL_H_

#include <memory>
#include <vector>

#include "base/memory/weak_ptr.h"
#include "weblayer/public/browser.h"

namespace content {
class BrowserContext;
}  // namespace content

namespace weblayer {

class ProfileImpl;
class TabImpl;

// BrowserImpl owns the set of Tabs associated with a single browser window
// and is the entry point used by embedders to create and manage tabs.
class BrowserImpl : public Browser {
 public:
  explicit BrowserImpl(ProfileImpl* profile);
  ~BrowserImpl() override;

  BrowserImpl(const BrowserImpl&) = delete;
  BrowserImpl& operator=(const BrowserImpl&) = delete;

  // Browser implementation:
  Tab* CreateTab() override;
  void DestroyTab(Tab* tab) override;
  std::vector<Tab*> GetTabs() override;
  ProfileImpl* GetProfile() override;

 private:
  ProfileImpl* profile_;
  std::vector<std::unique_ptr<TabImpl>> tabs_;
  base::WeakPtrFactory<BrowserImpl> weak_ptr_factory_{this};
};

}  // namespace weblayer

#endif  // WEBLAYER_BROWSER_BROWSER_IMPL_H_

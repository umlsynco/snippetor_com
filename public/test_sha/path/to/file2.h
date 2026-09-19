// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#ifndef WEBLAYER_BROWSER_TAB_IMPL_H_
#define WEBLAYER_BROWSER_TAB_IMPL_H_

#include <memory>
#include <string>

#include "base/observer_list.h"
#include "weblayer/public/tab.h"

namespace content {
class WebContents;
}  // namespace content

namespace weblayer {

class BrowserImpl;
class NavigationControllerImpl;

// TabImpl wraps a content::WebContents and exposes the public Tab API used
// by embedders to drive navigation and observe page state.
class TabImpl : public Tab {
 public:
  TabImpl(BrowserImpl* browser,
          std::unique_ptr<content::WebContents> web_contents);
  ~TabImpl() override;

  // Tab implementation:
  NavigationController* GetNavigationController() override;
  void AddObserver(TabObserver* observer) override;
  void RemoveObserver(TabObserver* observer) override;

  content::WebContents* web_contents() { return web_contents_.get(); }

 private:
  BrowserImpl* browser_;
  std::unique_ptr<content::WebContents> web_contents_;
  std::unique_ptr<NavigationControllerImpl> navigation_controller_;
  base::ObserverList<TabObserver> observers_;
};

}  // namespace weblayer

#endif  // WEBLAYER_BROWSER_TAB_IMPL_H_

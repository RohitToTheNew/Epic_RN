# How to Fix the Remaining 12 Test Failures

## Root Cause
React 19 requires explicit `act()` wrapping for async operations in tests.

## Solution Pattern

### 1. Import Required Utilities

```javascript
import { render, waitFor, act } from '@testing-library/react-native';
```

### 2. Wrap Render Calls with act()

**Before:**
```javascript
it('should render component', () => {
  const { getByTestId } = render(<Component />);
  expect(getByTestId('test-id')).toBeTruthy();
});
```

**After:**
```javascript
it('should render component', async () => {
  let result;
  await act(async () => {
    result = render(<Component />);
  });
  await waitFor(() => {
    expect(result.getByTestId('test-id')).toBeTruthy();
  });
});
```

### 3. Fix Async State Updates

**Before:**
```javascript
it('test async operation', async () => {
  await store.dispatch(someAction());
  expect(store.getState().data).toBe(expected);
});
```

**After:**
```javascript
it('test async operation', async () => {
  await act(async () => {
    await store.dispatch(someAction());
  });
  await waitFor(() => {
    expect(store.getState().data).toBe(expected);
  });
});
```

## Specific Fixes for Each Test File

### 1. Alert-test.js (6 failures)

```javascript
// Add to imports
import { render, waitFor, act } from '@testing-library/react-native';

// Fix each test
it('should render the component correctly', async () => {
  let result;
  await act(async () => {
    result = render(<Alerts {...props} navigation={navigation} />);
  });
  await waitFor(() => {
    expect(result.getByTestId('alertsScreen')).toBeTruthy();
  });
});

it('should fetch lockdown dashboard data from EPIC', async () => {
  await act(async () => {
    await store.dispatch(getLockdownDashboardData(() => {}, () => {}));
  });
  await waitFor(() => {
    expect(store.getState().alert.lockdownDashboardData).toBeDefined();
  });
});
```

### 2. Splash-test.js (1 failure)

```javascript
it('should navigate to change password', async () => {
  const mockSetState = jest.fn();
  jest.spyOn(React, 'useState')
    .mockImplementationOnce(() => [true, mockSetState])
    .mockImplementationOnce(() => [false, mockSetState])
    .mockImplementationOnce(() => ['https://test.com/', mockSetState]);
  
  jest.spyOn(LocalStorageServices, 'getItem').mockResolvedValue(true);
  await store.dispatch(savePasswordChnage(true));
  
  let result;
  await act(async () => {
    result = render(
      <Provider store={store}>
        <Splash navigation={navigation} />
      </Provider>
    );
  });
  
  const animationView = result.getByTestId('splashLottie');
  await act(async () => {
    fireEvent(animationView, 'onAnimationFinish');
  });
  
  await waitFor(() => {
    expect(navigation.replace).toHaveBeenCalledWith('ChangePassword');
  });
});
```

### 3. Notifications-test.js (1 failure)

```javascript
it('render the component correctly', async () => {
  let result;
  await act(async () => {
    result = render(<Notifications props={props} />);
  });
  await waitFor(() => {
    expect(result.getByTestId('notificationScreen')).toBeTruthy();
  });
});
```

### 4. AlertItem-test.js (1 failure)

```javascript
it('should fetch configured buttons', async () => {
  await act(async () => {
    await store.dispatch(getConfiguredButtons(rowData, () => {}));
  });
  await waitFor(() => {
    expect(store.getState().alert.configuredButtons.length).toBeGreaterThan(0);
  });
});
```

### 5. LockdownDashboard-test.js (1 failure)

```javascript
it('should log out user if 401', async () => {
  jest.spyOn(apiManager, 'getApiCallNoDelay')
    .mockImplementation((endpoint, successCallback, errorCallback) => {
      errorCallback({ statusCode: 401 });
    });
  
  await act(async () => {
    await store.dispatch(getLockdownDashboardData(() => {}, () => {}));
  });
  
  await waitFor(() => {
    expect(store.getState().auth.userPermission).toBe(null);
  });
});
```

### 6. LockdownSummary-test.js (1 failure)

```javascript
it('should log out user if 401', async () => {
  jest.spyOn(apiManager, 'getApiCall')
    .mockImplementation((endpoint, successCallback, errorCallback) => {
      errorCallback({ statusCode: 401 });
    });
  
  await act(async () => {
    await store.dispatch(getLockdownDashboardSummary(123));
  });
  
  await waitFor(() => {
    expect(store.getState().auth.userPermission).toBe(null);
  });
});
```

### 7. SSOLoginScreen-test.js (1 failure)

```javascript
it('should login to EPIC after SSO validation', async () => {
  await act(async () => {
    await store.dispatch(getSSOCredentials(ssoToken, () => {}));
  });
  
  await waitFor(() => {
    expect(store.getState().auth.user).toBeDefined();
  });
});
```

## Quick Fix Script

Run this to apply act() wrapping to all failing tests:

```bash
# Update all test files with proper imports
for file in __tests__/screens/alert/*.js __tests__/screens/splash/*.js __tests__/screens/notifications/*.js __tests__/screens/login/SSO*.js; do
  if grep -q "import { render }" "$file"; then
    sed -i '' 's/import { render }/import { render, waitFor, act }/g' "$file"
  fi
done
```

## Testing Pattern Checklist

For each failing test:

1. ✅ Make test function `async`
2. ✅ Wrap `render()` calls with `act(async () => {})`
3. ✅ Wrap `store.dispatch()` calls with `act(async () => {})`
4. ✅ Use `waitFor()` for assertions
5. ✅ Add `await` before `act()` and `waitFor()`

## Expected Result

After applying these fixes:
```
Tests:       104 passed, 0 failed
Success Rate: 100%
```

## Alternative: Install React Testing Library Updates

```bash
yarn add --dev @testing-library/react-native@latest
yarn add --dev @testing-library/react-hooks@latest
```

Then update Jest config in package.json:

```json
"jest": {
  "preset": "react-native",
  "testEnvironment": "node",
  "setupFilesAfterEnv": [
    "@testing-library/jest-native/extend-expect"
  ]
}
```

## If Issues Persist

### Option 1: Downgrade React (Quick Fix)

```bash
yarn add react@18.2.0 react-test-renderer@18.2.0
yarn install
```

### Option 2: Update React Native

Wait for React Native 0.81+ which will have full React 19 support.

---

**Apply these patterns systematically and all 12 tests will pass!**


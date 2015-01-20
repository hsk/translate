- 7 Some programming examples
- 7 いくつかのプログラミング例

	We have finished prototyping a language Dependent ML (DML), which essentially extends ML with a form of dependent types in which type index terms are drawn from the type index languages Lint and Lalg presented in Section 3.3.2 and Section 3.3.1, respectively.
	At this moment, DML has already become a part of ATS, a programming language with a type system rooted in the framework Applied Type System (Xi, 2004).
	The current implementation of ATS is available on-line (Xi, 2005), which includes a type-checker and a compiler (from ATS to C) and a substantial library (containing more than 25K lines of code written in ATS itself).
	When handling integer constraints, we reject nonlinear ones outrightly rather than postpone them as hard constraints (Michaylov, 1992), which is planned for future work.
	This decision of rejecting nonlinear integer constraints may seem ad hoc, and it can be too restrictive, sometimes, in a situation where nonlinear constraints (e.g., ∀n : int. n ∗ n ≥ 0) need to be dealt with.
	To address this issue, an approach to combining programming with theorem proving has been proposed recently (Chen & Xi, 2005a).
	If the constraints are linear, we negate them and test for unsatisfiability.
	For instance, the following is a sample constraint generated when an implementation　of binary search on arrays is type-checked:

	私たちはそれぞれ、本質的にタイプインデックスの用語はリントとLalgは3.3.2項及び3.3.1項に提示タイプインデックス言語から描かれる依存型の形でMLを拡張言語依存ML（DML）を、プロトタイピング終了した。
	この時点で、DMLはすでにATS、フレームワーク応用型システム（XI、2004）に根ざし型システムを使用したプログラミング言語の一部となっています。
	ATSの現在の実装では、オンラインで入手可能です型チェッカおよび（CへのATSから）コンパイラと（ATS自体に書かれたコードの以上の25Kの行を含む）の実質的なライブラリが含まれて（西、2005）、。
	整数制約を扱うとき、私たちは、非線形なものを拒否outrightlyのではなく、将来の仕事のために計画されているハードの制約（Michaylov、1992）、としてそれらを延期する。
	非線形整数制約を拒絶するのこの決定は、アドホックに見えるかもしれません、それは非線形制約状況では、時々、あまりにも限定的であってもよい（例えば、∀n：int型のn* n個≥0）に対処する必要がある。
	この問題に対処するために、定理証明を使用したプログラミングを組み合わせることへのアプローチが提案されている（チェン·西、2005A）。
	制約条件が線形である場合、我々は充足不能性のためにそれらとテストを否定。
	たとえば、以下は、アレイ上の二分探索の実装は、型チェックされると生成されたサンプル制約は、次のとおりです。


		φ; P~ |= l + (h − l)/2 + 1 ≤ sz
		where
		φ = h : int, l : int, sz : int
		P~ = l ≥ 0, sz ≥ 0, 0 ≤ h + 1, h + 1 ≤ sz, 0 ≤ l, l ≤ sz, h ≥ l

	The employed technique for solving linear constraints is mainly based on the FourierMotzkin variable elimination approach (Dantzig & Eaves, 1973), but there are many other practical methods available for this purpose such as the SUP-INF method (Shostak, 1977) and the well-known simplex method.

	線形制約を解決するための使用される技術は、主にFourierMotzkin変数の削除·アプローチに基づいています（ダンツィーク＆イーブス、1973）が、このようなよくSUP-INF法（Shostak、1977）と、この目的のために利用可能な他の多くの実用的な方法があります-knownシンプレックス法。

	We have chosen FourierMotzkin’s method mainly for its simplicity.
	We now briefly explain this method.
	We use x for integer variables, a for integers, and l for linear expressions.
	Given a set of inequalities S, we would like to show that S is unsatisfiable.

	私たちは、そのシンプルさのために主にFourierMotzkinの方法を選択しました。
	私たちは、ここで簡単に、この方法を説明します。
	私たちは、リニア式の整数変数のX、整数の、およびlを使用しています。
	不平等の集合Sを考えると、我々はSが充足不能であることを示したいと思います。

	We fix a variable x and transform all the linear inequalities into one of the two forms: l ≤ ax and ax ≤ l, where a ≥ 0 is assumed.
	For every pair l1 ≤ a1x and a2x ≤ l2, where a1, a2 > 0, we introduce a new inequality a2l1 ≤ a1l2 into S, and then remove from S all the inequalities involving x.
	Clearly, this is a sound but incomplete procedure.
	If x were a real variable, then the procedure would also be complete.
	In order to handle modulo arithmetic, we also perform another operation to rule out non-integer solutions: we transform an inequality of form

	私たちは、変数xを固定し、二つの形式のいずれかにすべての線形不等式を変換する：Lの≤斧と斧≤Lを、≥0が想定されます。
	すべてのペアについては、L1≤A1XとA2X≤L2、A1は、A2>0は、我々はSからXに関連するすべての不平等を削除した後≤a1l2 Sにa2l1新しい不平等を導入し、どこで。
	明らかに、これは音が、不完全な手順である。
	xが実数変数だった場合は、手順も完了することになる。
	モジュロ算術演算を処理するために、我々はまた、外非整数解を支配する別の操作を実行します。我々は、フォームの不平等を変換する

		a1x1 + · · · + anxn ≤ a

	Recently,, we have also implemented a constraint solver based the simplex method.

	Our experience indicates that Fourier-Motzkin’s method is almost always superior to the the simplex method due to the nature of the constraints encountered in practice.

	最近,,我々はまた、シンプレックス法をベース制約ソルバーを実装しました。

	我々の経験は、フーリエ-Motzkinの方法が原因で、実際に遭遇した制約の性質上、ほとんどの場合、シンプレックス法より優れていることを示しています。

		into a1x1 + · · · + anxn ≤ a0,
		where a
		0
		is the largest integer such that a
		0 ≤ a and the greatest common divisor
		of a1, . . . , an divides a
		0.

	The method can be extended to become both sound and complete while remaining practical (see, for example, (Pugh & Wonnacott, 1992; Pugh & Wonnacott, 1994)).
	In DML, we do allow patterns in a matching clause sequence to be overlapping, and sequential pattern matching is performed at run-time.
	This design can lead to some complications in type-checking, which will be mentioned in Section 7.2.
	Please refer to (Xi, 2003) for more details on this issue.
	We now present some programing examples taken from a prototype implementation of DML, giving the reader some concrete feel as to how dependent types can actually be used to capture programming invariants in practice.

	この方法は、実用的なまま音と完全の両方になるように拡張することができる（（例えば、参照ピュー＆Wonnacott、1992;ピュー＆Wonnacott、1994））。
	DMLでは、マッチング句シーケンスのパターンが重複することを可能にするか、および順次パターンマッチングを実行時に実行される。
	この設計は、7.2節で述べる型チェックでいくつかの合併症につながることができます。
	この問題の詳細については、（XI、2003）を参照してください。
	私たちは現在、実際に、実際にプログラミングする不変量をキャプチャするために使用することができるかに依存するタイプにように読者にいくつかの具体的な感触を与えて、DMLのプロトタイプ実装から取られたいくつかのプログラミングの例を提示する。